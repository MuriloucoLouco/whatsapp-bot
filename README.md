# Whatsapp Bot

Programa para automatização de respostas no Whatsapp. Ele utiliza o puppeteer para ler e enviar mensagens do Whatsapp Web.

## Instalação:

### Requisitos

Você precisa do node instalado em sua máquina para usar o bot. [Leia mais sobre como instalar o node.](https://nodejs.org/pt-br/)

Por hora, ele só é capaz de responder apenas um grupo.

### Instalando

* Abra o terminal na pasta de instalação.
* Clone o repositório: `git clone https://github.com/MuriloucoLouco/whatsapp-bot.git && cd whatsapp-bot`

Caso você esteja no windows, execute esse comando:

`npm config set puppeteer_product firefox`

Caso esteja no linux:

`PUPPETEER_PRODUCT=firefox`

Por fim, instale todos os pacotes necessários:

`npm install`

### Criando configurações necessárias

Você precisa editar o arquivo `config.json` na pasta onde o bot foi instalado.
Dentro dele, mude o valor `"chat"` para o nome de seu grupo.
O valor `"key"` é sua chave de autenticação da API do youtube, que é necessário para o comando `/youtube`.

## Usando

Para iniciar, execute o seguinte comando no terminal:

`npm start`

Espere o bot dizer "carregando QR Code...". Quando ele disser, abra o arquivo qrcode.jpg, e escaneie o código com o celular.

Pronto! O bot já está ligado e pronto para uso. Envie o comando `/help` no chat para ler seus comandos.

## Criando novos comandos

Para criar novos comandos, altere a função `handle_commands` no arquivo `message_handler.js`.

Para enviar uma resposta, a função é: `await send_message('String da mensagem', page);`.
