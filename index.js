const fs = require('fs');
const { get_whatsapp, get_qrcode, go_to_chat } = require('./src/load_whatsapp.js');
const start_bot = require('./src/start_bot.js');
const { delay } = require('./src/tools.js');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

async function main() {
    page = await get_whatsapp();
    console.log('Carregando QR Code...');
    await delay(1000);
    page = await get_qrcode(page);
    console.log('QR Code carregado.')
	
    console.log('Carregando Web Whatsapp...');
    page = await go_to_chat(page, config.chat);
	console.log('Whatsapp carregado. Iniciando o bot...');

    await start_bot(page);
	console.log('Bot iniciado!');
	console.log();
}

main();