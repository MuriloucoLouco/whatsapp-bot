const fs = require('fs');
const { get_whatsapp, get_qrcode, go_to_chat } = require('./src/load_whatsapp.js');
const start_bot = require('./src/start_bot.js');
const { delay } = require('./src/tools.js');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

async function main() {
	let { page, browser } = await get_whatsapp();
    console.log('Carregando QR Code...');
    page = await get_qrcode(page);
    console.log('QR Code carregado.')
	
    console.log('Carregando Web Whatsapp...');
    page = await go_to_chat(page, config.chat);
	console.log('Whatsapp carregado. Iniciando o bot...');

    await start_bot(page, browser);
	console.log('Bot iniciado! Pressione "q" para desligar o bot.');
	console.log();
}

main();