const Bot = require('./bot.js');
const message_handler = require('./message_handler.js');

async function start_bot(page) {
	bot = new Bot(page);
	
	await bot.send_message('Bot iniciado.');
	
	bot.on('new_message', async new_message => {
		await message_handler(new_message, bot);
	});
	
	bot.on('user_added', async user => {
		await bot.send_message(`NOVO USUÁRIO ADICIONADO! ${user}`);
		if (user.split(' ')[0] == '+1') {
			await bot.send_message('DDI +1 detectado, removendo...');
			await bot.ban(user);
		} else {
			await bot.send_message('Bem-vindo(a) ao grupo! Use o comando /help para listar meus comandos.');
		}
	});
	
	await bot.start();
}

module.exports = start_bot;