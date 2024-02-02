import { create } from "@wppconnect-team/wppconnect";
import { spawn } from "child_process";




create().then((client) => start(client));

const botCommands = {
  comandos: "comandos",
  oi: "oi",
  tchau: "tchau",
  pesquisa: "pesquisa",
  menciona: "menciona"
};

async function returnAllCommands() {
  let allCommands = "";
  for (const command in botCommands) {
    allCommands += $`*/{command}*\n`;
  }
  return allCommands;
}


async function returnPesquisa(query) {
  const pyProg = spawn("python", ["./src/python/pesquisa.py", query]);

  return new Promise((resolve, reject) => {
    let dataBuffer = '';

    pyProg.stdout.on("data", function (data) {
      dataBuffer += data.toString();
    });

    pyProg.stderr.on("data", function (data) {
      reject(data.toString());
    });

    pyProg.on('close', (code) => {
      if (code === 0) {
        resolve(dataBuffer);
      } else {
        reject(`O script Python encerrou com código ${code}`);
      }
    });
  });
}
async function createMessageFromPesquisa(products) {
  let message = "";

  if (products && products.length > 0) {
    for (let i = 0; i < products.length; i++) {
      message += `*${products[i].name}* \n
      ${products[i].price}\n
      ${products[i].parc}\n
      ${products[i].url}\n

      \n\n`;
    }
  }

  return message;
}



function start(client) {
  client.onMessage(async (message) => {
    if (message.body.startsWith("/")){
      const command = message.body.replace(/^\/(\w+)(?:\s(.*))?/, '$1');
      console.log(message.sender.pushname + " enviou " + command);
      let response;
      switch (command) {
        case botCommands.oi:
          response = `Olá, tudo bem ${message.sender.pushname}? 😊👋`;
          await client.sendText(message.from, response).then((result) => {
            console.log("Result: ", result); //return object success}
          }).catch((erro) => {  
            console.error("Error when sending: ", erro); //return object error
          });
          break;
        case botCommands.tchau:
          response = `Tchau, até logo! 👋`;
          await client.sendText(message.from, response);
          break;
        case botCommands.comandos:
          response = await returnAllCommands();
          await client.reply(
            message.from,
            "Lista de comandos:\n" + response
          );
          break;
        case botCommands.pesquisa:
          let query = message.body.replace(/^[^ ]+\s+/, "");
          console.log(query);
          client.sendText(message.from, "Aguarde um momento. Pesquisando sobre " + query + "...");
          response = await returnPesquisa(query);
          // response = await createMessageFromPesquisa(response);
          // console.log(response);
          await client.sendText(message.from,  JSON.parse(response));
         
          await client.sendText(message.from, "Pesquisa concluída.");
          break;
        case botCommands.menciona:
          const participants = await client.message.groupMetadata.participants;
            
          let response = '';
          participants.forEach((participant) => {
            if (participant.id.user !== 'status@broadcast') {
              response += `@${participant.id.user.replace(/@c.us/g, '')} `;
            }
          });
          await client.sendText(message.from, response);
          break;
         
        // default:
        //   response = `Desculpe, o comando "${command}" não é reconhecido. Digite /commands para ver a lista de comandos disponíveis.`;
        //   await client.sendText(message.from, response);
        //   break;
      }
    }
  });
}
        
          
