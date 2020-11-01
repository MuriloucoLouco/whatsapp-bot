async function get_last_message(page) {
    message_data = await page.evaluate(() => {
        message_list = document.getElementsByClassName('message-in');
        message_node = message_list[message_list.length - 1];
        
        message = '';
        id = message_node.dataset.id;
        details_element = message_node.querySelector('._274yw').children;
        try {
            user = details_element[details_element.length - 2].dataset.prePlainText.slice(20, -2);
            date = details_element[details_element.length - 2].dataset.prePlainText.slice(1,18);
        } catch (error) {
            console.error(error);
        }

        message_element = message_node.getElementsByClassName('selectable-text')[0];

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
        
        message_data = { message, user, date, id };
        console.log(message_data);
        return message_data;
    });
        
    return message_data;
}

module.exports = get_last_message;