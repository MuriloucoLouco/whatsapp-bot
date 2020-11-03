const { delay } = require('./tools.js');

async function send_message(message, page) {
    await page.evaluate((message) => {
        e = new InputEvent('input', {bubbles: true});
        message_element = document.getElementsByClassName('_3FRCZ')[1];
        message_element.textContent = message;
        message_element.dispatchEvent(e);
        document.querySelector('._1U1xa').click();
    }, message);
}

//NÃO FUNCIONA AINDA, ESTÁ EM FASE DE TESTE.
async function send_file(file_name, page) {
    clip = await page.$('._295He > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)');
    await clip.click();
    await page.waitForSelector('._1dxx-');
    await page.waitForSelector('li._1N-3y:nth-child(3) > button:nth-child(1)');
    // file_button = await page.$('li._1N-3y:nth-child(3) > button:nth-child(1)');
    // await file_button.click();
    input = await page.$('li._1N-3y:nth-child(3) > button:nth-child(1) > input:nth-child(2)');
    input.uploadFile(file_name);
    await page.waitForSelector('._3y5oW');
    send_button = await page.$('._3y5oW');
    send_button.click();
}

async function ban_user(user, page) {
	await page.waitForSelector('.DP7CM');
	title = await page.$('.DP7CM');
	await title.click();
	await page.waitForSelector('.LwCwJ');
	more_users = await page.$('._18cLH._3X7RF');
	
	if (more_users) {
		await more_users.click();
	}

	user_index = await page.evaluate((user) => {
		return [...document.getElementsByClassName('_2kHpK')].findIndex(item => {
			if (item.querySelector('._3ko75._5h6Y_._3Whw5')) {
				return item.querySelector('._3ko75._5h6Y_._3Whw5').textContent == user && item.querySelector('.m61XR').innerHTML.length != 5;
			}
		});
	}, user);
	

	user_list = await page.$$('._2kHpK');
	user_element = user_list[user_index];
	
	if (user_element) {
		user_element.click({button: 'right'});
	
		await page.waitForSelector('.Ut_N0.n-CQr');
		await delay(200);
		action_buttons = await page.$$('.Ut_N0.n-CQr');
		remove_button = action_buttons[1];
		await remove_button.click();
		
		await delay(200);
		await page.waitForSelector('.S7_rT.FV2Qy');
		remove_confirm = await page.$('.S7_rT.FV2Qy');
		await remove_confirm.click();
		
		await delay(600);
		await page.waitForSelector('.t4a8o');
		page.click('.t4a8o');
	}
}

module.exports = { send_message, send_file, ban_user };