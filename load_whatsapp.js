const puppeteer = require('puppeteer');
const fs = require('fs');
const { delay } = require('./tools.js');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

async function get_whatsapp() {
    const browser = await puppeteer.launch({product: 'firefox', headless: config.headless});
    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');
    return page;
}

async function get_qrcode(page) {
    await page.screenshot({path: './qrcode.jpg', type: 'jpeg'});

    await page.waitForSelector('._210SC');
    return page;
}

async function go_to_chat(page, chat) {
    await page.waitForSelector('._210SC');

	chat_index = await page.evaluate(name => {
		chat_list = [];
		[...document.getElementsByClassName('_210SC')].forEach(element => {
			chat_list.push([element.style['-moz-transform'].split('(')[1].slice(0,-3), element]);
		})
		
		chat_list = chat_list.sort((a, b) => a[0] - b[0]);
		return chat_list.findIndex((item, index, arr) => {
			return item[1].getElementsByClassName('_3ko75')[0].title == name;
		});
	}, chat);

	chat_nodelist = await page.$$('._3ko75');
	
	for (i = 0; i <= chat_index; i++) {
		await page.keyboard.down('AltLeft');
		await page.keyboard.down('ControlLeft');
		await page.keyboard.down('Tab');
		delay(50);
		await page.keyboard.up('AltLeft');
		await page.keyboard.up('ControlLeft');
		await page.keyboard.up('Tab');
		delay(50);
    }
    
    return page;
}

module.exports = { get_whatsapp, get_qrcode, go_to_chat };