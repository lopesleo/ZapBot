# README.md

## Introdução

Este é um guia abrangente para o projeto de estudo que integra JavaScript e Python para realizar funções específicas. O projeto inclui um script JavaScript para automação de mensagens no WhatsApp usando a biblioteca `@wppconnect-team/wppconnect` e um script Python para realizar pesquisas de produtos na Amazon.

## Requisitos de Instalação

Certifique-se de ter o Node.js e o Python instalados em sua máquina antes de prosseguir.

- [Node.js](https://nodejs.org/) (v14.x ou superior)
- [Python](https://www.python.org/) (v3.x)
- [Google Chrome](https://www.google.com/chrome/) (para o Selenium WebDriver)

## Instalação das Dependências

Instale as dependências do projeto executando os seguintes comandos no terminal:

```bash
npm install @wppconnect-team/wppconnect
```

## Utilização

### Script JavaScript

O script JavaScript (`whatsapp.js`) é responsável por automatizar o envio de mensagens no WhatsApp. Ele utiliza a biblioteca `@wppconnect-team/wppconnect` para se conectar ao WhatsApp Web.

Para executar o script, utilize o seguinte comando:

```bash
node whatsapp.js
```

### Script Python

O script Python (`pesquisa.py`) realiza pesquisas de produtos na Amazon. Ele utiliza a biblioteca Selenium para automatizar a navegação na web.

Para executar o script, utilize o seguinte comando, seguido do termo de pesquisa desejado:

```bash
python pesquisa.py "termo de pesquisa"
```

Certifique-se de ter o Google Chrome instalado e configurado corretamente para o Selenium WebDriver.

## Estrutura do Projeto

```
.
├── src/
│   ├── javascript/
│   │   └── whatsapp.js
│   └── python/
│       └── pesquisa.py
├── README.md

```

## Funcionalidades

### Comandos Disponíveis no WhatsApp

O script JavaScript oferece os seguintes comandos para interagir no WhatsApp:

- `/oi`: Envia uma saudação personalizada.
- `/tchau`: Envia uma despedida.
- `/comandos`: Lista todos os comandos disponíveis.
- `/pesquisa [termo]`: Realiza uma pesquisa na Amazon com o termo especificado e retorna valores dos itens + informações.
- `/menciona`: Menciona todos os participantes de um grupo.

### Pesquisa na Amazon

O script Python realiza pesquisas de produtos na Amazon. Ele retorna uma lista de produtos correspondentes ao termo de pesquisa fornecido.

## Notas Adicionais

- Certifique-se de fornecer permissões adequadas para execução dos scripts, se necessário.
- Este projeto é apenas para fins educacionais e de demonstração.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

---

Este README foi criado com amor e Markdown por Leonardo Lopes. Dúvidas ou sugestões? Entre em contato! 🚀
