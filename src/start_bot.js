const Bot = require('./bot.js');
const message_handler = require('./message_handler.js');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

async function start_bot(page) {
	bot = new Bot(page);
	
	await bot.send_message('Bot iniciado.');
	
	bot.on('new_message', async new_message => {
		if (new_message.message.includes('chat.whatsapp.com') && config.ban_on_link) {
			await bot.send_message('Proibido envio de link no grupo.');
			await bot.ban(new_message.user);
		} else {
			await message_handler(new_message, bot);
		}
	});
	
	bot.on('user_via_link', async user => {
		await bot.send_message(`Usuário entrou por um link! ${user}`);
		if (user.split(' ')[0] == '+1' && config.ban_us_number) {
			await bot.send_message('DDI +1 detectado, removendo...');
			await bot.ban(user);
		} else {
			await bot.send_message('Bem-vindo(a) ao grupo! Use o comando /help para listar meus comandos.');
		}
	});
	
	await bot.start();
}

module.exports = start_bot;