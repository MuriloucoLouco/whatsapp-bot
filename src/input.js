async function send_message(message, page) {
    await page.evaluate((message) => {
        e = new InputEvent('input', {bubbles: true});
        message_element = document.getElementsByClassName('_3FRCZ')[1];
        message_element.textContent = message;
        message_element.dispatchEvent(e);
        document.querySelector('._1U1xa').click();
    }, message);
}

async function send_file(file_name, page) {
    clip = await page.$('._295He > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)');
    await clip.click();
    await page.waitForSelector('._1dxx-');
    await page.waitForSelector('li._1N-3y:nth-child(3) > button:nth-child(1)-');
    file_button = await page.$('li._1N-3y:nth-child(3) > button:nth-child(1)-');
    await file_button.click();
    input = await page.$('li._1N-3y:nth-child(3) > button:nth-child(1) > input:nth-child(2)');
    input.uploadFile(file_name);
    await page.waitForSelector('._3y5oW');
    send_button = await page.$('._3y5oW');
    send_button.click();
}

module.exports = { send_message, send_file };