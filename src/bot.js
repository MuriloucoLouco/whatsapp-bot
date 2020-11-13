const { delay } = require('./tools.js');

module.exports = class Bot {
	constructor(page) {
		this.page = page;
		this.listeners = {};
	}
	
	async send_message(message) {
		await this.page.evaluate((message) => {
			e = new InputEvent('input', {bubbles: true});
			message_element = document.getElementsByClassName('_3FRCZ')[1];
			message_element.textContent = message;
			message_element.dispatchEvent(e);
			document.querySelector('._1U1xa').click();
		}, message);
	}
	
	async ban(user) {
		await this.page.waitForSelector('.DP7CM');
		let title = await this.page.$('.DP7CM');
		await title.click();
		await this.page.waitForSelector('.LwCwJ');
		let more_users = await this.page.$('._18cLH._3X7RF');
		
		if (more_users) {
			await more_users.click();
		}

		let user_index = await this.page.evaluate((user) => {
			return [...document.getElementsByClassName('_2kHpK')].findIndex(item => {
				if (item.querySelector('._3ko75._5h6Y_._3Whw5')) {
					return item.querySelector('._3ko75._5h6Y_._3Whw5').textContent == user && item.querySelector('.m61XR').innerHTML.length != 5;
				}
			});
		}, user);
		

		let user_list = await this.page.$$('._2kHpK');
		let user_element = user_list[user_index];
		
		if (user_element) {
			user_element.click({button: 'right'});
		
			await this.page.waitForSelector('.Ut_N0.n-CQr');
			await delay(200);
			let action_buttons = await this.page.$$('.Ut_N0.n-CQr');
			let remove_button = action_buttons[1];
			await remove_button.click();
			
			await delay(300);
			await this.page.waitForSelector('.S7_rT.FV2Qy');
			let remove_confirm = await this.page.$('.S7_rT.FV2Qy');
			await remove_confirm.click();
			
			await delay(600);
			await this.page.waitForSelector('.t4a8o');
			this.page.click('.t4a8o');
		}
	}
	
	async get_last_transit() {
		let user_data = await this.page.evaluate(() => {
			let user = '';
			let id = '';
			let method = '';
			
			alert_list = [...document.querySelectorAll('._2et95._1E1g0')].filter(alert => !!alert.querySelector('._5h6Y_.FdF4z._3Whw5'));
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
				
				last_alert = alert_list[alert_list.length - 1].querySelectorAll('._5h6Y_.FdF4z._3Whw5');
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
				date = message_node.getElementsByClassName('_18lLQ')[0].textContent;
			} catch (error) {
				date = '';
			}
			
			try {
				user = message_node.getElementsByClassName('FMlAw FdF4z _3Whw5')[0].textContent;
			} catch (error) {
				try {
					user_element = message_node.querySelector('._274yw').children;
					user = user_element[user_element.length - 2].dataset.prePlainText.slice(20, -2);
				} catch (err) {
					user = message_node.querySelector('._3UUTc').textContent;
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
	
	on(method, callback) {
		this.listeners[method] = callback;
	}
	
	async start_transit_listener() {
		var last_transit = await this.get_last_transit();
		setInterval(async () => {
			let new_transit = await this.get_last_transit();
			if (last_transit.id != new_transit.id) {
				if (this.listeners['user_left'] && new_transit.method == 'left') {
					this.listeners['user_left'](new_transit.user);
				}
				if (this.listeners['user_removed'] && new_transit.method == 'removed') {
					this.listeners['user_removed'](new_transit.user);
				}
				if (this.listeners['user_added'] && new_transit.method == 'added') {
					this.listeners['user_added'](new_transit.user);
				}
				if (this.listeners['user_via_link'] && new_transit.method == 'via_link') {
					this.listeners['user_via_link'](new_transit.user);
				}
				if (this.listeners['user_transit']) {
					this.listeners['user_transit'](new_transit.user, new_transit.methods);
				}
			}
			last_transit = await this.get_last_transit();
		}, 50);
	}
	
	async start_message_listener() {
		await this.page.waitForSelector('.message-in');
		var last_message = await this.get_last_message();
		
		setInterval(async () => {
			let new_message = await this.get_last_message();
			if (last_message.id != new_message.id) {
				if (this.listeners['new_message']) {
					this.listeners['new_message'](new_message);
				}
			}
			last_message = new_message;
		}, 50);
	}
	
	async start() {
		await this.start_message_listener();
		await this.start_transit_listener();
	}
}