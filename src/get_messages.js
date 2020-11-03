async function get_last_message(page) {
	message_data = await page.evaluate(() => {
		message_list = document.getElementsByClassName('message-in');
		message_node = message_list[message_list.length - 1];
		
		message = '';
		id = message_node.dataset.id;
		date = message_node.getElementsByClassName('_18lLQ')[0].textContent;
		
		try {
			user = message_node.getElementsByClassName('FMlAw FdF4z _3Whw5')[0].textContent;
		} catch (error) {
			console.log(error);
			user_element = message_node.querySelector('._274yw').children;
			user = user_element[user_element.length - 2].dataset.prePlainText.slice(20, -2);
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

module.exports = get_last_message;