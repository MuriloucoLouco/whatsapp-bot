const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { delay } = require('./tools.js');
const { exec } = require('child_process');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

async function get_whatsapp() {
    const browser = await puppeteer.launch({product: 'firefox', headless: config.headless});
    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');
    return { page, browser };
}

async function get_qrcode(page) {
	await page.waitForSelector('canvas');
    await page.screenshot({path: path.join(__dirname, '../qrcode/qrcode.jpg'), type: 'jpeg'});
	await delay(1000);
	
	var child = exec('python qrcode/qrcode2text.py');
	child.on('exit', () => {
		console.log(fs.readFileSync(path.join(__dirname, '../qrcode/qrcode.txt'), 'utf8'));
	});
	
	await page.waitForSelector('._1MZWu');
    return page;
}

async function go_to_chat(page, chat) {
	await page.waitForSelector('img._3t3gU.rlUm6._1VzZY');
	await delay(1000);
	
	chat_index = await page.evaluate(name => {
		chat_list = [];
		[...document.getElementsByClassName('_1MZWu')].forEach(element => {
			chat_list.push([element.style['transform'].split('(')[1].slice(0,-3), element]);
		})
		
		chat_list = chat_list.sort((a, b) => a[0] - b[0]);
		return chat_list.findIndex((item, index, arr) => {
			return item[1].getElementsByClassName('_1hI5g')[0].title == name;
		});
	}, chat);

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
	
	try {
        await page.waitForSelector('._1UuMR');
    } catch (error) {
		console.log('Chat não carregado. Tentando novamente... Verifique que mudou o chat no config.json');
		await page.keyboard.down('AltLeft');
		await page.keyboard.down('ControlLeft');
		await page.keyboard.down('Tab');
		delay(50);
		await page.keyboard.up('AltLeft');
		await page.keyboard.up('ControlLeft');
		await page.keyboard.up('Tab');
		delay(50);
		await page.keyboard.down('AltLeft');
		await page.keyboard.down('ControlLeft');
		await page.keyboard.down('ShiftLeft');
		await page.keyboard.down('Tab');
		delay(50);
		await page.keyboard.up('AltLeft');
		await page.keyboard.up('ControlLeft');
		await page.keyboard.up('ShiftLeft');
		await page.keyboard.up('Tab');
		delay(50);
    }
	
	await page.waitForSelector('.message-in');
    return page;
}

module.exports = { get_whatsapp, get_qrcode, go_to_chat };
