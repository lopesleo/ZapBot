import { MessageType, create } from "@wppconnect-team/wppconnect";
import { spawn } from "child_process";
import "@wppconnect-team/wppconnect";
import axios from "axios";
import fs from "fs";
import sharp from "sharp";
create().then((client) => start(client));

const botCommands = {
  comandos: "comandos",
  oi: "oi",
  tchau: "tchau",
  pesquisa: "pesquisa",
  menciona: "menciona",
  fig: "fig",
};

async function returnAllCommands() {
  let allCommands = "";
  for (const command in botCommands) {
    allCommands += `*-${command}*\n`;
  }
  return allCommands;
}

async function returnPesquisa(query) {
  const pyProg = spawn("python", ["./src/python/pesquisa.py", query]);

  return new Promise((resolve, reject) => {
    let dataBuffer = "";

    pyProg.stdout.on("data", function (data) {
      dataBuffer += data.toString();
    });

    pyProg.stderr.on("data", function (data) {
      reject(data.toString());
    });

    pyProg.on("close", (code) => {
      if (code === 0) {
        resolve(dataBuffer);
      } else {
        reject(`O script Python encerrou com código ${code}`);
      }
    });
  });
}

function start(client) {
  client.onMessage(async (message) => {
    if (client == undefined) return;
    if (message.body.startsWith("-") || message.caption.startsWith("-")) {
      let command;
      if (message.type === MessageType.IMAGE) {
        command = message.caption.replace(/^\-(\w+)(?:\s(.*))?/, "$1");
      } else {
        command = message.body.replace(/^\-(\w+)(?:\s(.*))?/, "$1");
      }

      console.log(message.sender.pushname + " enviou " + command);

      let response = "";
      switch (command) {
        case botCommands.oi:
          response = `Olá, tudo bem ${message.sender.pushname}? 😊👋`;
          await client
            .sendText(message.from, response)
            .then((result) => {
              console.log("Result: ", result); //return object success}
            })
            .catch((erro) => {
              console.error("Error when sending: ", erro); //return object error
            });
          break;
        case botCommands.tchau:
          response = `Tchau, até logo! 👋`;
          await client.sendText(message.from, response);
          break;
        case botCommands.pesquisa:
          let query = message.body.replace(/^[^ ]+\s+/, "");
          console.log(query);
          client.sendText(
            message.from,
            "Aguarde um momento. Pesquisando sobre " + query + "..."
          );

          try {
            const response = await returnPesquisa(query);
            console.log("Resposta da pesquisa:");
            console.log(response);

            // Mapeia os resultados da pesquisa para baixar e enviar imagens simultaneamente
            const produtos = JSON.parse(response);

            for (const item of produtos) {
              const imageUrl = item.image_url;
              const imageName = imageUrl.split("/").pop();
              const imagePath = `./src/images/${imageName}`;

              try {
                const imageResponse = await axios.get(imageUrl, {
                  responseType: "stream",
                });

                await new Promise((resolve, reject) => {
                  const imageStream = fs.createWriteStream(imagePath);
                  imageResponse.data.pipe(imageStream);
                  imageStream.on("finish", () => {
                    console.log("Imagem baixada com sucesso!");
                    resolve();
                  });
                  imageStream.on("error", (err) => {
                    reject(err);
                  });
                });

                await client.sendImage(
                  message.from,
                  imagePath,
                  imageName,
                  `Nome: ${item.name}\nPreço: ${item.price}\nParcelamento: ${item.parc}\nLink para compra: ${item.url}`
                );
                fs.unlinkSync(imagePath);
              } catch (error) {
                console.error("Erro ao baixar ou enviar a imagem:", error);
              }
            }

            await client.sendText(message.from, "Pesquisa concluída.");
          } catch (error) {
            console.error("Erro durante a pesquisa:", error);
            await client.sendText(
              message.from,
              "Ocorreu um erro durante a pesquisa."
            );
          }
          break;
        case botCommands.comandos:
          response = await returnAllCommands();
          await client.sendText(message.from, response);
          break;
        case botCommands.menciona:
          if (message.isGroupMsg === true) {
            const participants = await client.getGroupMembers(message.chatId);
            
            response = "";
            client.sendText(message.chatId, "Chamando todos os Cornos do grupo... 🐂🐂")
            participants.forEach((participant) => {
              if (participant.id.user !== "status@broadcast") {
                response += `@${participant.id.user.replace(/@c.us/g, "")} `;
              }
            });
            // Envia a mensagem para o grupo
            client.sendText(message.chatId, response);
          } else {
            response = `Esse comando só pode ser usado em grupos.`;
            await client.sendText(message.from, response);
          }
          break;
        case botCommands.fig:
          response = `Criando figurinha...`;
          await client.sendText(message.from, response);

          if (message.mimetype && message.mimetype.includes("image")) {
            const mediaData = await client.decryptFile(message);

            const imageName = `figurinha-${message.from}.png`;
            const imagePath = `./src/images/${imageName}`;

            const resizedImage = await sharp(mediaData)
              .resize({
                width: 512,
                height: 512,
                fit: "contain", // Manter a proporção original da imagem, ajustando-a para caber completamente dentro das dimensões especificadas
                background: { r: 255, g: 255, b: 255, alpha: 0 }, // Fundo transparente para a imagem redimensionada
              })
              .png()
              .toBuffer();
            // Salvar a imagem redimensionada
            fs.writeFileSync(imagePath, resizedImage);

            const imageBase64 = `data:${
              message.mimetype
            };base64,${resizedImage.toString("base64")}`;

            await client.sendImageAsSticker(message.from, imageBase64);
            fs.unlinkSync(imagePath);
            break;
          }
           else {
            response = `Você precisa enviar uma imagem para que eu possa criar uma figurinha.`;
            await client.sendText(message.from, response);
            break;
          }

        default:
          if (message.type != MessageType.IMAGE) {
            response = `Desculpe, o comando "${command}" não é reconhecido. Digite -comandos para ver a lista de comandos disponíveis.`;

            await client.sendText(message.from, response);
          }
          break;
      }
    }
  });
}
