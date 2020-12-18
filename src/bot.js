const EventEmitter = require('events');
const { delay } = require('./tools.js');

module.exports = class Bot extends EventEmitter {
	constructor(page) {
		super();
		this.page = page;
	}
	
	async send_message(message) {
		await this.page.evaluate((message) => {
			
			e = new InputEvent('input', {bubbles: true});
			message_element = document.getElementsByClassName('_1awRl')[1];
			message_element.textContent = message ? message : 'ERRO: RESPOSTA VAZIA.\Confira o message_handler.js';
			message_element.dispatchEvent(e);
			document.querySelector('._2Ujuu').click();
		}, message);
	}
	
	async ban(user) {
		await this.page.waitForSelector('.YEe1t');
		let title = await this.page.$('.YEe1t');
		await title.click();
		await this.page.waitForSelector('._2a1zO');
		let more_users = await this.page.$('._3I3b7._1HmfW');
		
		if (more_users) {
			await more_users.click();
		}

		let user_index = await this.page.evaluate((user) => {
			return [...document.getElementsByClassName('_1MZWu')].findIndex(item => {
				if (item.querySelector('._1hI5g._1XH7x._1VzZY')) {
					return item.querySelector('._1hI5g._1XH7x._1VzZY').textContent == user && item.querySelector('._2gsiG').innerHTML.length != 5;
				}
			});
		}, user);
		

		let user_list = await this.page.$$('._1MZWu');
		let user_element = user_list[user_index];
		
		if (user_element) {
			user_element.click({button: 'right'});
		
			await this.page.waitForSelector('._1OwwW._3oTCZ');
			await delay(200);
			let action_buttons = await this.page.$$('._1OwwW._3oTCZ');
			let remove_button = action_buttons[1];
			await remove_button.click();
			
			await delay(300);
			await this.page.waitForSelector('._30EVj.gMRg5');
			let remove_confirm = await this.page.$('._30EVj.gMRg5');
			await remove_confirm.click();
			
			await delay(600);
			await this.page.waitForSelector('.hYtwT');
			this.page.click('.hYtwT');
		}
	}
	
	async get_last_transit() {
		let user_data = await this.page.evaluate(() => {
			let user = '';
			let id = '';
			let method = '';
			
			let alert_list = [...document.querySelectorAll('._1ij5F.KpuSa')].filter(alert => !!alert.querySelector('._1XH7x._3cwQ7._1VzZY'));
			if (alert_list.length > 0) {
				id = alert_list[alert_list.length - 1].parentElement.dataset.id.split('@g.us_')[1];
				let message = alert_list[alert_list.length - 1].textContent;
				if (message.includes('link de convite')) {
					method = 'via_link';
				}
				if (message.includes('adicionou')) {
					method = 'added';
				}
				if (message.includes('removeu')) {
					method = 'removed';
				}
				if (message.includes('saiu')) {
					method = 'left';
				}
				
				last_alert = alert_list[alert_list.length - 1].querySelectorAll('._1XH7x._3cwQ7._1VzZY');
				user_element = last_alert[last_alert.length - 1];
				if (user_element) {
					user = user_element.textContent;
				}
			}
			
			return { user, id, method };
		});
		return user_data;
	}
	
	async get_last_message() {
		let message_data = await this.page.evaluate(() => {
			message_list = document.getElementsByClassName('message-in');
			message_node = message_list[message_list.length - 1];
			
			message = '';
			
			try {
				id = message_node.dataset.id.split('@g.us_')[1];
			} catch (error) {
				id = '';
			}
			try {
				date = message_node.getElementsByClassName('_2JNr-')[0].textContent;
			} catch (error) {
				date = '';
			}
			
			try {
				user = message_node.getElementsByClassName('_19038 _3cwQ7 _1VzZY')[0].textContent;
			} catch (error) {
				try {
					user_element = message_node.querySelector('._1dB-m').children;
					user = user_element[user_element.length - 2].dataset.prePlainText.slice(20, -2);
				} catch (err) {
					console.log(err);
				}
			}
			
			message_element = message_node.getElementsByClassName('selectable-text')[0];
			if (message_element) {
				if (message_element.childElementCount > 1) {
					message_element.childNodes.forEach(node => {
						message += node.children[0].alt;
					});
				} else {
					message_element.children[0].childNodes.forEach(node => {
						if (node.tagName == 'IMG') {
							message += node.alt;
						} else {
							message += node.textContent;
						}
					});
				}
			} else {
				message = '';
			}
			
			message_data = { message, user, date, id };
			return message_data;
		});
		
		return message_data;
	}
	
	async start_transit_listener() {
		let last_transit = await this.get_last_transit();
		setInterval(async () => {
			let new_transit = await this.get_last_transit();
			if (last_transit.id != new_transit.id) {
				console.log(new_transit);
				switch (new_transit.method) {
					case 'left':
						this.emit('user_left', new_transit.user);
						break;
					case 'removed':
						this.emit('user_removed', new_transit.user);
						break;
					case 'added':
						this.emit('user_added', new_transit.user);
						break;
					case 'via_link':
						this.emit('user_via_link', new_transit.user);
						break;
				}
				this.emit('user_transit', new_transit.user, new_transit.methods);
			}
			last_transit = await this.get_last_transit();
		}, 50);
	}
	
	async start_message_listener() {
		await this.page.waitForSelector('.message-in');
		let last_message = await this.get_last_message();
		
		setInterval(async () => {
			let new_message = await this.get_last_message();
			if (last_message.id != new_message.id) {
				this.emit('new_message', new_message);
			}
			last_message = new_message;
		}, 50);
	}
	
	async start() {
		await this.start_message_listener();
		await this.start_transit_listener();
	}
}