const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { youtube_search, get_piada, get_luiz, pony_search, r34_search } = require('./tools.js');

const HELP = fs.readFileSync(path.join(__dirname, '../db/help.txt'), 'latin1');

let poll_list = [];

async function message_handler({ message, user, date, id }, bot) {
  console.log({ message, user, date, id });
  const args = message.replace('\n', ' ').split(' ');
  switch (args[0]) {
    case '/help':
      await bot.send_message(HELP);
      break;
      
    case '/say':
      await bot.send_message(args.slice(1).join(' '));
      break;
      
    case '/cyberpunk':
      let unix_since = Math.round(Date.now() / 1000) - 1607576400;
      let days = Math.floor(unix_since / 86400);
      let hours = Math.floor((unix_since - (days * 86400)) / 3600);
      let minutes = Math.floor((unix_since - (days * 86400) - (hours * 3600)) / 60);
      let seconds = unix_since - (days * 86400) - (hours * 3600) - (minutes * 60);
      await bot.send_message(`Passaram ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos desde a maior decepção da geração (ao todo, ${unix_since} segundos). São ${days} dias de negação do Cosenza, quando ele passará para o próximo estágio do luto, a raiva?`);
      break;
      
    case '/bola8':
      const respostas = ['Sim.', 'Não.', 'Talvez.', 'Esse é o mistério da noite...', 'Com certeza.', 'Jamais.', 'Não sei, pergunte para o Murilo.', 'Sim', 'Não'];
      await bot.send_message(respostas[Math.floor(Math.random() * respostas.length)]);
      break;
      
    case '/luiz':
      await bot.send_message(get_luiz());
      break;
      
    case '/love':
      if (args.length < 3) {
        await bot.send_message('Indique duas pessoas para calcular o amor.');
      } else {
        if (args[2] != 'e') {
          const hashed_1 = [...crypto.createHash('md5').update(args[1]+'l').digest('hex')].filter(letter => !('abcdef'.includes(letter))).join('').slice(0,5);
          const hashed_2 = [...crypto.createHash('md5').update(args[2]+'l').digest('hex')].filter(letter => !('abcdef'.includes(letter))).join('').slice(0,5);
          let percentage = Math.abs(Number(hashed_1) + Number(hashed_2)) / 2000;
          if (percentage > 60 && percentage < 83) percentage *= 1.2;
          
          percentage = String(Math.round(percentage));
          
          let mensagem_extra = '';
          if (percentage >= 80) {
            mensagem_extra = 'Vocês são o casal perfeito 💞💞!';
          } else if (percentage < 80 && percentage >= 60) {
            mensagem_extra = 'Vocês são um par em potencial!. 🙂';
          } else if (percentage < 60 && percentage >= 40) {
            mensagem_extra = 'Talvez deveriam ser amigos? 😬';
          } else if (percentage < 40 && percentage >= 20) {
            mensagem_extra = 'Vocês não são o melhor par. 😕';
          } else {
            mensagem_extra = 'Fiquem o mais longe possível! 🤬';
          }
          await bot.send_message(`${args[1]} ❤️ ${args[2]}: Sua compatibilidade é de ${percentage}%. ${mensagem_extra}`);
        } else if (args[1] != 'e') {
          await bot.send_message('CARALHO, SEU IMBECIL, QUAL A DIFICULDADE DE ENTENDER QUE NÃO É PARA COLOCAR "e" ENTRE OS DOIS NOMES? O CERTO É "/love nome1 nome2", SEU FILHO DE MIL PROSTITUTAS, SE VOCÊ FIZER ESSA MERDA DE NOVO EU ACABO COM A RAÇA HUMANA, SEU BOSTA DO CARALHO.');
        } else {
          await bot.send_message('Vai dar o cu, eu sei que você fez isso de propósito.');
        }
      }
      break;
      
    case '/roll':
      const random_number = Math.round(Math.random() * args[1]);
      await bot.send_message(random_number);
      break;
      
    case '/f':
      await bot.send_message('F');
      break;
      
    case '/youtube':
      url = await youtube_search(args.slice(1).join(' '));
      await bot.send_message(url);
      break;
      
    case '/piada':
      piada = get_piada();
      await bot.send_message(piada);
      break;
      
    case '/pony':
      const { view_url, tags } = await pony_search(args.slice(1).join(' '));
      if (view_url && tags) {
        await bot.send_message(`LINK: ${view_url}\n\nTAGS: ${tags.join(' ')}`);
      } else {
        await bot.send_message(`Não encontrei nada com o termo de busca "${args.slice(1).join(' ')}"`)
      }
      break;
    
    case '/cosenza': {
      const r34data = await r34_search('sonic');
      await bot.send_message(`Resultado para rule34 de sonic:\n${r34data.file_url}\n\nTags: ${r34data.tags.join(' ')}`);
      break;
    }
      
    case '/r34': {
      const r34data = await r34_search(args.slice(1).join(' '));
      await bot.send_message(`Resultado para rule34 de ${args.slice(1).join(' ')}:\n${r34data.file_url}\n\nTags: ${r34data.tags.join(' ')}`);
      break;
    }
      
    case 'Bom':
    case 'bom': {
      const hour = Number(date.split(':')[0]);
      if (args[1] == 'dia' || args[1] == 'dia.' || args[1] == 'dia,') {
        if (hour >= 12 && hour < 18) {
          await bot.send_message(`Bom dia, mas o certo não seria "boa tarde"? O horário aqui é ${date}.`);
        }
        if (hour >= 18 && hour < 24) {
          await bot.send_message(`Bom dia, mas o certo não seria "boa noite"? O horário aqui é ${date}.`);
        }
        if (hour < 12 && hour >= 0) {
          await bot.send_message('Bom dia.');
        }
      }
      break;
    }
    case 'Boa':
    case 'boa': {
      const hour = Number(date.split(':')[0]);
      if (args[1] == 'tarde' || args[1] == 'tarde.' || args[1] == 'tarde,') {
        if (hour < 12 && hour >= 0) {
          await bot.send_message(`Boa tarde, mas o certo não seria "bom dia"? O horário aqui é ${date}.`);
        }
        if (hour >= 18 && hour < 24) {
          await bot.send_message(`Boa tarde, mas o certo não seria "boa noite"? O horário aqui é ${date}.`);
        }
        if (hour >= 12 && hour < 18) {
          await bot.send_message('Boa tarde.');
        }
      }
      if (args[1] == 'noite' || args[1] == 'noite.' || args[1] == 'noite,') {
        if (hour < 12 && hour >= 0) {
          await bot.send_message(`Boa noite, mas o certo não seria "bom dia"? O horário aqui é ${date}.`);
        }
        if (hour >= 12 && hour < 18) {
          await bot.send_message(`Boa noite, mas o certo não seria "boa tarde"? O horário aqui é ${date}.`);
        }
        if (hour >= 18 && hour < 24) {
          await bot.send_message('Boa noite.');
        }
      }
      break;
    }

    case '/poll':
      if (args[1] == 'create') {
        let lines = message.split('\n');
        lines.shift();
        
        if (lines.length < 3) {
          await bot.send_message('Você precisa especificar um título e mais de duas alternativas.');
          return;
        }
        
        let poll_title = lines.shift();
        let poll_alternatives = [];
        
        lines.forEach(line => {
          poll_alternatives.push({
            name: line,
            votes: []
          });
        });
        
        let id = poll_list.length;
        poll_list.push({
          title: poll_title,
          alternatives: poll_alternatives,
          id: id,
          voters: []
        });
        
        await bot.send_message(`Criado votação com ID ${id}:\n${poll_title}\n\nPara responder, digite: /poll answer ${id} <nº da alternativa>`);
      }

      if (args[1] == 'answer') {
        if (args.length < 4) {
          await bot.send_message('Formato: /poll answer <id> <nº da alternativa>');
          return;
        }
        
        if (isNaN(Number(args[2])) || isNaN(Number(args[3]))) {
          await bot.send_message('Formato: /poll answer <id> <nº da alternativa>');
          return;
        }
        
        let id = Number(args[2]);
        let alternative_number = Number(args[3] - 1);
        
        if (typeof(poll_list[id]) == 'undefined') {
          await bot.send_message('Votação com ID selecionado não existe.');
          return;
        }
        
        if (typeof(poll_list[id].alternatives[alternative_number]) == 'undefined') {
          await bot.send_message('Essa alternativa não existe.');
          return;
        }
        
        if (poll_list[id].voters.includes(user)) {
          await bot.send_message('Você já votou.');
          return;
        }
        
        poll_list[id].voters.push(user);
        poll_list[id].alternatives[alternative_number].votes.push(user);
        
        let poll_response = `Resultados da votação:\n${poll_list[id].title}\n`;
        let total_votes = poll_list[id].voters.length;
        
        poll_list[id].alternatives.forEach(alternative => {
          let percentage = Math.round(alternative.votes.length / total_votes * 100);
          poll_response += `${alternative.name} : ${percentage}%\n`;
        });
        
        await bot.send_message(poll_response);
      }
      break;
      
  }
}

module.exports = message_handler;
