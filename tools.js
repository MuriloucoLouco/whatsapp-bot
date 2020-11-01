const fetch = require('node-fetch');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const key = config.key;

const piadas = JSON.parse(fs.readFileSync('piadas.json', 'utf8'));

function delay(time) {
    return new Promise(resolve => { 
        setTimeout(resolve, time)
    });
}

async function youtube_search(search_term) {
	if (key) {
		url = 'https://youtube.com/watch?v=';
		video_list = [];
		
		await fetch(`https://www.googleapis.com/youtube/v3/search?q=${search_term}&key=${key}`)
		.then(res => res.json())
		.then(obj => obj.items)
		.then(videos => videos.forEach(video => {
			if (video.id.kind == 'youtube#video') {
				video_list.push(video.id.videoId);
			}
		}));
		
		url += video_list[0];
		return url;
	} else {
		return 'Não há uma API key do youtube.';
	}
}

function get_piada() {
	piada = piadas[Math.floor(Math.random() * piadas.length)];
	return piada;
}

module.exports = { delay, youtube_search, get_piada };