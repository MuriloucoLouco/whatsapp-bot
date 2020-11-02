const fs = require('fs');
const path = require('path');
const send_message = require('./input.js');
const { youtube_search, get_piada } = require('./tools.js');

const HELP = fs.readFileSync(path.join(__dirname, '../db/help.txt'), 'utf8');

async function message_handler({ message, user, date }, page) {
    console.log(message);
    args = message.split(' ');
    switch (args[0]) {
        case '/help':
            await send_message(HELP, page);
            break;
        case '/say':
            await send_message(args.slice(1).join(' '), page);
            break;
        case '/cyberpunk':
            unix_until = 1607572800 - Math.round(Date.now() / 1000);
            days = Math.floor(unix_until / 86400);
            hours = Math.floor((unix_until - (days * 86400)) / 3600);
            minutes = Math.floor((unix_until - (days * 86400) - (hours * 3600)) / 60);
            seconds = unix_until - (days * 86400) - (hours * 3600) - (minutes * 60);
            await send_message(`Faltam ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos para o lançamento de cyberpunk.`, page);
            break;
        case '/bola8':
            respostas = ['Sim.', 'Não.', 'Talvez.', 'Esse é o mistério da noite...', 'Com certeza.', 'Jamais.', 'Não sei, pergunte para o Murilo.', 'Sim', 'Não'];
            await send_message(respostas[Math.floor(Math.random() * respostas.length)], page);
            break;
        case '/luiz':
            respostas = ['slk 🔥', 'aff 🙈', 'voa mlk 🔥', '🦾🦾🦾', 'mol lara', 'affs 🙈🍃', 'nerd', 'nerdola', 'olha o romeu', 'mostra o shape', '@Murilo faz resenha desse som',
            '.', 'Linda Esta Muito Bom O Nosso Papo Mas Q Tal Irmos Para Minha Casa Para Vc Ficar Pelada Um Pouquinho ...', 'Pow Novinha Q Tal Fazermos 1 Sexo ..',
            'eae piranha ..  volta aki com meu lanca', 'nois ta tipo bts deixando as novinha loka  b de brabo t de traste s de safado', 'novinha voce e uma flor 😏',
            'história do meu nome: meus avós e pais perguntaram alguns nomes pro pessoal conhecido, colocaram em papéis, enfiaram num saco e fizeram um sorteio, o primeiro q saiu foi esse (Luiz)',
            'tchola', 'nois é patife 👀🔥', 'sla mano mol fita', 'porra de lol mlk vai lamber uma x0t4($)', 'silencio grupo... romeu ta mimindo...', 'acad',
            'eh tipo um filho\neu n vo por um filho no mundo pra ele n ser fodao avassalador de novinha', 'u + voce + caminha quentinha + cobertor de oncinha + cuequinha boxer + eu + vc + fuc fuc = lover',
        'Filha da puta ce eu não te comi eh que o naipe do pai vai domina sua mente'];
            await send_message(respostas[Math.floor(Math.random() * respostas.length)], page);
            break;
        case '/love':
            if (args.length < 3) {
                await send_message('Indique duas pessoas para calcular o amor.', page)
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
                await send_message(`${args[1]} ❤️ ${args[2]}: Sua compatibilidade é de ${percentage}%. ${mensagem_extra}`, page);
            }
            break;
        case '/roll':
            random_number = Math.round(Math.random() * args[1]);
            await send_message(random_number, page);
            break;
        case '/f':
            await send_message('F', page);
            break;
        case '/youtube':
            url = await youtube_search(args.slice(1).join(' '));
            await send_message(url, page);
			break;
        case '/piada':
            piada = get_piada();
            await send_message(piada, page);
			break;
		case 'Bom':
		case 'bom':
			hour = Number(date.split(':')[0]);
			if (args[1] == 'dia' || args[1] == 'dia.' || args[1] == 'dia,') {
				if (hour >= 12 && hour < 18) {
					await send_message('Bom dia, mas o certo não seria "boa tarde"? O horário aqui é ${date}.', page);
				}
				if (hour >= 18 && hour < 24) {
					await send_message('Bom dia, mas o certo não seria "boa noite"? O horário aqui é ${date}.', page);
				}
				else {
					await send_message('Bom dia.', page);
				}
			}
			break;
		case 'Boa':
		case 'boa':
			hour = Number('20:33'.split(':')[0]);
			if (args[1] == 'tarde' || args[1] == 'tarde.' || args[1] == 'tarde,') {
				if (hour <= 12 && hour >= 0) {
					await send_message('Boa tarde, mas o certo não seria "bom dia"? O horário aqui é ${date}.', page);
				}
				if (hour >= 18 && hour < 24) {
					await send_message('Boa tarde, mas o certo não seria "boa noite"? O horário aqui é ${date}.', page);
				}
				else {
					await send_message('Boa tarde.', page);
				}
			}
			if (args[1] == 'noite' || args[1] == 'noite.' || args[1] == 'noite,') {
				if (hour <= 12 && hour >= 0) {
					await send_message('Boa noite, mas o certo não seria "bom dia"? O horário aqui é ${date}.', page);
				}
				if (hour >= 12 && hour < 18) {
					await send_message('Boa noite, mas o certo não seria "boa tarde"? O horário aqui é ${date}.', page);
				}
				else {
					await send_message('Boa noite.', page);
				}
			}
			break;
    }
}

module.exports = message_handler;