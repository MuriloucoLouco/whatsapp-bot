const puppeteer = require('puppeteer');
const { exec } = require("child_process");
const { type } = require('os');

function delay(time) {
    return new Promise(resolve => { 
        setTimeout(resolve, time)
    });
}

function send_message(message) {
    e = new InputEvent('input', {bubbles: true});
    message_element = document.getElementsByClassName('_3FRCZ')[1];
    message_element.textContent = message;
    message_element.dispatchEvent(e);
    document.querySelector('._1U1xa').click();
}

async function main() {
    var test = 'TESTE';
	const browser = await puppeteer.launch({product:'firefox', headless: false});
    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');

    console.log('Carregando qr code...')
    await delay(1500);

    await page.screenshot({path: './temp/image.jpg', type: 'jpeg'});

    /*
    //convert temp/image.jpg -crop 264x264+448+152 temp/qrcode.png
    exec('convert temp/image.jpg -crop 264x264+440+152 qrcode.png && rm temp/image.jpg', (error, stdout, stderr) => {
        if (error) {
            console.log(error.message);
            return;
        }
        if (stderr) {
            console.log(error.message);
            return;
        }
        console.log(stdout);
    });

    await delay(200);

    //sxiv qrcode.png
    
    exec('sxiv qrcode.png', (error, stdout, stderr) => {
        if (error) {
            console.log(error.message);
            return;
        }
        if (stderr) {
            console.log(error.message);
            return;
        }
        console.log(stdout);
    });
    */

    async function send_message(message) {
        await page.evaluate((message) => {
            e = new InputEvent('input', {bubbles: true});
            message_element = document.getElementsByClassName('_3FRCZ')[1];
            message_element.textContent = message;
            message_element.dispatchEvent(e);
            document.querySelector('._1U1xa').click();
        }, message);
    }

    async function get_last_message() {
        last_message = await page.evaluate(() => {
            message_list = document.getElementsByClassName('message-in');
            last_message = message_list[message_list.length - 1];
            
            return last_message;
        });
        return last_message;
    }

    async function message_to_data(message_node) {
        message = '';
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
        
        details = { message, user, date };
    }

    async function start_message_listening() {
        last_message = get_last_message();
        setInterval(async () => {
            if (last_message == get_last_message()) {

            }
            last_message = await get_last_message();
        }, 10);
        
    }

    async function handle_commands({ message, user, date }) {
        console.log(message);
        args = message.split(' ');
        help = `
    /help - Mostra a ajuda;
    /say <mensagem> - Diz uma mensagem;
    /cyberpunk - Diz o tempo que falta até lançar o cyberpunk.
    /bola8 - Responde uma pergunta de sim ou não.
    /luiz - Imita o Luiz.
    /love <pessoa1> <pessoa2> - Calcula o amor entre duas pessoas.
    /roll <número> - Gera um número aleatório entre 1 e o número.
    É só isso. Dêem ideias do que fazer.
        `;;
        switch (args[0]) {
            case '/help':
                await send_message(help);
                break;
            case '/say':
                await send_message(args.slice(1).join(' '));
                break;
            case '/cyberpunk':
                unix_until = 1607572800 - Math.round(Date.now() / 1000);
                days = Math.floor(unix_until / 86400);
                hours = Math.floor((unix_until - (days * 86400)) / 3600);
                minutes = Math.floor((unix_until - (days * 86400) - (hours * 3600)) / 60);
                seconds = unix_until - (days * 86400) - (hours * 3600) - (minutes * 60);
                await send_message(`Faltam ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos para o lançamento de cyberpunk.`);
                break;
            case '/bola8':
                respostas = ['Sim.', 'Não.', 'Talvez.', 'Esse é o mistério da noite...', 'Com certeza.', 'Jamais.', 'Não sei, pergunte para o Murilo.', 'Sim', 'Não'];
                await send_message(respostas[Math.floor(Math.random() * respostas.length)]);
                break;
            case '/luiz':
                respostas = ['slk 🔥', 'aff 🙈', 'voa mlk 🔥', '🦾🦾🦾', 'mol lara', 'affs 🙈🍃', 'nerd', 'nerdola', 'olha o romeu', 'mostra o shape', '@Murilo faz resenha desse som', '.', 'Linda Esta Muito Bom O Nosso Papo Mas Q Tal Irmos Para Minha Casa Para Vc Ficar Pelada Um Pouquinho ...', 'Pow Novinha Q Tal Fazermos 1 Sexo ..', 'eae piranha ..  volta aki com meu lanca', 'nois ta tipo bts deixando as novinha loka  b de brabo t de traste s de safado', 'novinha voce e uma flor 😏', 'história do meu nome: meus avós e pais perguntaram alguns nomes pro pessoal conhecido, colocaram em papéis, enfiaram num saco e fizeram um sorteio, o primeiro q saiu foi esse (Luiz)', 'tchola', 'nois é patife 👀🔥', 'sla mano mol fita', 'porra de lol mlk vai lamber uma x0t4($)', 'silencio grupo... romeu ta mimindo...', 'acad', 'eh tipo um filho\neu n vo por um filho no mundo pra ele n ser fodao avassalador de novinha'];
                await send_message(respostas[Math.floor(Math.random() * respostas.length)]);
                break;
            case '/love':
                if (args.length < 3) {
                    await send_message('Indique duas pessoas para calcular o amor.')
                } else {
                    percentage = Math.round(Math.random()*100);
                    mensagem_extra = ''
                    if (percentage >= 80) {
                        mensagem_extra = 'Vocês são o casal perfeito 💞💞!';
                    } else if (percentage < 80 && percentage >= 50) {
                        mensagem_extra = 'Vocês podem combinar, é só querer. 🙂';
                    } else if (percentage < 50 && percentage >= 20) {
                        mensagem_extra = 'Vocês não nasceram um para o outro, mas podem ser amigos. 😬';
                    } else {
                        mensagem_extra = 'Fiquem o mais longe possível! 🤬';
                    }
                    await send_message(`${args[1]} ❤️ ${args[2]}: Sua compatibilidade é de ${percentage}%. ${mensagem_extra}`);
                }
                break;
            case '/roll':
                random_number = Math.round(Math.random() * args[1]);
                await send_message(random_number);
                break;
        }
    }

    await start_message_listening();
    page.evaluate(() => {
        document.addEventListener('newmessage', async (e) => {
            console.log(e);
            await handle_commands(e.detail);
        });
    });

    console.log('Carregando Web Whatsapp...');
    await delay(10000);
    await send_message('test');
    teste = await get_last_message();
    console.log();
    //await browser.close();
}

main();