const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Bot = require('./bot.js');
const Snake = require('./snake.js');
const message_handler = require('./message_handler.js');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

async function start_bot(page, browser) {
	
	process.stdin.on('keypress', async (str, key) => {
		if ((key && key.name == 'q') || (key && key.ctrl && key.name == 'c')) {
			console.log();
			console.log('Desligando o bot...');
			await bot.send_message('Desligando o bot...');
			snake.save_settings();
			process.exit(0);
		}
	});
	
	const bot = new Bot(page);
	const snake = new Snake();
	
	await bot.send_message('Bot iniciado.');
	
	//comandos normais
	bot.on('new_message', async new_message => {
		if (new_message.message.includes('chat.whatsapp.com') && config.ban_on_link) {
			await bot.send_message('Proibido envio de link no grupo.');
			await bot.ban(new_message.user);
		} else {
			await message_handler(new_message, bot);
		}
	});

	//comando da cobra (especial)
	bot.on('new_message', async new_message => {
		let args = new_message.message.split(' ');
		if (args[0] == '/cobra' || args[0] == '/snake') {
			switch (args[1]) {
				case 'cima':
				case 'up':
					snake.up();
					break;
				case 'baixo':
				case 'down':
					snake.down();
					break;
				case 'esquerda':
				case 'left':
					snake.left();
					break;
				case 'direita':
				case 'right':
					snake.right();
					break;
				case 'fundo':
				case 'background':
					snake.change_background(args[2]);
					break;
				case 'pele':
				case 'skin':
					snake.change_skin(args[2]);
					break;

			}
			snake_text = snake.render();
			await bot.send_message(snake_text);
		}
		switch (new_message.message) {
			case '⬆️' :
				snake.up();
				snake_text = snake.render();
				await bot.send_message(snake_text);
				break;
			case '⬇️' :
				snake.down();
				snake_text = snake.render();
				await bot.send_message(snake_text);
				break;
			case '⬅️' :
				snake.left();
				snake_text = snake.render();
				await bot.send_message(snake_text);
				break;
			case '➡️' :
				snake.right();
				snake_text = snake.render();
				await bot.send_message(snake_text);
				break;
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