# Whatsapp Bot

Programa para automatização de respostas no Whatsapp. Ele utiliza o puppeteer para ler e enviar mensagens do Whatsapp Web.

## Funções e metas:

- [x] Ler mensagens.
- [x] Enviar mensagens.
- [x] Banir usuários.
- [ ] Enviar imagens.
- [ ] Enviar áudios.
- [ ] Enviar arquivos.

Por hora, ele só é capaz de responder apenas um grupo.

## Instalação:

### Requisitos

Você precisa do node instalado em sua máquina para usar o bot. [Leia mais sobre como instalar o node.](https://nodejs.org/pt-br/)

Também será necessário o python3. [Leia mais sobre como instalar o python.](https://www.python.org/)

### Instalando

* Abra o terminal na pasta de instalação.
* Clone o repositório: `git clone https://github.com/MuriloucoLouco/whatsapp-bot.git && cd whatsapp-bot`

Caso você esteja no windows, execute esse comando:

`npm config set puppeteer_product firefox`

Caso esteja no linux:

`PUPPETEER_PRODUCT=firefox`

Por fim, instale todos os pacotes necessários, tanto do node, quanto do python:

`pip install Pillow`

`npm install`

### Criando configurações necessárias

Você precisa editar o arquivo `config.json` na pasta onde o bot foi instalado.
Dentro dele, mude o valor `"chat"` para o nome de seu grupo.
O valor `"key"` é sua chave de autenticação da API do youtube, que é necessário para o comando `/youtube`.

O resto das configurações serão auto-explicativas.

## Usando

Para iniciar, execute o seguinte comando no terminal:

`npm start`

Espere o bot carregar o qrcode e escaneie o código com o celular. Certifique-se que mudou o `"chat"` no `config.json`.

Pronto! O bot já está ligado e pronto para uso. Envie o comando `/help` no chat para ler seus comandos.

## Customizando o bot

A lógica do bot será processada no arquivo `start_bot.js`.

O funcionamento é de eventos:

```
bot = new Bot();
bot.on('nome do evento', funcao_callback);
```

### A lista de eventos e funções do bot:

#### Eventos:

* `'new_message'` - Disparado sempre que chegar uma nova mensagem. Sua estrutura é `{ message, user, date, id }`.
* `user_left` - Disparado após um membro sair do grupo.
* `user_removed` - Disparado após um membro ser removido.
* `user_added` - Disparado após um membro ser adicionado no grupo.
* `user_via_link` - Disparado após um membro entrar no grupo usando um link.

Todos os últimos quatro tem a mesma estrutura: `{ user, id }`.

* `user_tranit` - Disparado quando qualquer um dos quatro acima for disparado. Sua estrutura é `{ user, id, method }`.

#### Funções:

* `ban(user)` - Bane o usuário.
* `send_message(message)` - Envia uma mensagem.
