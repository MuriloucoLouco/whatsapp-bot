async function send_message(message, page) {
    await page.evaluate((message) => {
        e = new InputEvent('input', {bubbles: true});
        message_element = document.getElementsByClassName('_3FRCZ')[1];
        message_element.textContent = message;
        message_element.dispatchEvent(e);
        document.querySelector('._1U1xa').click();
    }, message);
}

module.exports = send_message;