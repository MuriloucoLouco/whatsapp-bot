const fs = require('fs');
const path = require('path');

const SIZE = 9;

function rand_number(size) {
    return Math.floor(Math.random() * size);
}

module.exports = class Snake {
    constructor() {
		let rawdata = fs.readFileSync(path.join(__dirname, '../db/snake.json'), 'utf8');
		let snake_settings = JSON.parse(rawdata);

        this.fruit = snake_settings.fruit[0] ? snake_settings.fruit : [rand_number(SIZE), rand_number(SIZE)];
        this.snake = snake_settings.snake[0] ? snake_settings.snake : [[5, 5], [4, 5], [3, 5]];
		this.background = snake_settings.background;
		this.skin = snake_settings.skin;
    }
	
	save_settings() {
		let settings = {
			"fruit": this.fruit,
			"snake": this.snake,
			"background" : this.background,
			"skin" : this.skin
		};
		
		fs.writeFileSync(path.join(__dirname, '../db/snake.json'), JSON.stringify(settings), 'utf8');
	}
	
	change_skin(color) {
		switch (color) {
			case '🟨':
				this.skin.head = '😎';
				this.skin.body = '🟨';
				break;
			case '🟫':
				this.skin.head = '💩';
				this.skin.body = '🟫';
				break;
			case '🟩':
				this.skin.head = '👽';
				this.skin.body = '🟩';
				break;
			case '🟥':
				this.skin.head = '🤖';
				this.skin.body = '🟥';
				break;
			case '🟦':
				this.skin.head = '🧿';
				this.skin.body = '🟦';
				break;
			case '🟧':
				this.skin.head = '🥵';
				this.skin.body = '🟧';
				break;
			case '🟪':
				this.skin.head = '😈';
				this.skin.body = '🟪';
				break;
		}
	}

	change_background(color) {
		switch (color) {
			case '⬜':
				this.background = '⬜';
				break;
			case '⬛':
				this.background = '⬛';
				break;
		}
	}

    up() {
        let new_head = [this.snake[0][0], this.snake[0][1] - 1];
        this.update(new_head);
    }

    down() {
        let new_head = [this.snake[0][0], this.snake[0][1] + 1];
        this.update(new_head);
    }

    left() {
        let new_head = [this.snake[0][0] - 1, this.snake[0][1]];
        this.update(new_head);
    }

    right() {
        let new_head = [this.snake[0][0] + 1, this.snake[0][1]];
        this.update(new_head);
    }

    new_apple() {
        this.fruit = [rand_number(SIZE), rand_number(SIZE)];
    }

    reset() {
        this.fruit = [rand_number(SIZE), rand_number(SIZE)];
        this.snake = [[5, 5], [4, 5], [3, 5]];
    }

    update(new_head) {
		this.snake.unshift(new_head);
        if (!(this.snake[0][0] == this.fruit[0] && this.snake[0][1] == this.fruit[1])) {
            this.snake.pop();
        } else {
            this.new_apple();
        }
		
		if (this.snake[0][0] < 0 || this.snake[0][0] > SIZE - 1 || this.snake[0][1] < 0 || this.snake[0][1] > SIZE - 1) {
            this.reset();
        }
		
		this.snake.slice(1).forEach(body => {
			if (this.snake[0][0] == body[0] && this.snake[0][1] == body[1]) {
				this.reset();
			}
		});
    }

	render() {
		let rendered = '';
		for (let i = 0; i < SIZE; i++) {
			for (let j = 0; j < SIZE; j++) {
				if (this.fruit[0] == j && this.fruit[1] == i) {
					rendered += '🍎';
				} else {
					rendered += this.background;
				}
				this.snake.forEach((body, index) => {
					if (body[0] == j && body[1] == i) {
						if (rendered.slice(-1) == this.background) {
							rendered = rendered.slice(0,-1);
						} else {
							rendered = rendered.slice(0,-2);
						}
						if (index == 0) {
							rendered += this.skin.head;
						} else {
							rendered += this.skin.body;
						}
					}
				});
			}
			rendered += '\n';
		}

		return rendered;
	}
}