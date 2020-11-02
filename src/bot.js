const get_last_message = require('./get_messages.js');
const message_handler = require('./message_handler.js');

async function start_bot(page) {
    await page.waitForSelector('.message-in');

    last_message = await get_last_message(page);
    setInterval(async () => {
        new_message = await get_last_message(page);
        if (last_message.id != new_message.id) {
            message_handler(new_message, page);
        }
        last_message = new_message;
    }, 50);
}

module.exports = start_bot;