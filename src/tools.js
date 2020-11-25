const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const parseString = require('xml2js').parseString;

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));
const piadas = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/piadas.json'), 'utf8'));

function delay(time) {
    return new Promise(resolve => { 
        setTimeout(resolve, time)
    });
}

async function youtube_search(search_term) {
	if (config.key) {
		let url = 'https://youtube.com/watch?v=';
		const video_list = [];
		
		await fetch(`https://www.googleapis.com/youtube/v3/search?q=${search_term}&key=${config.key}`)
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
	const piada = piadas[Math.floor(Math.random() * piadas.length)];
	return piada;
}

async function pony_search(query) {
	post = {view_url: '', tags: []};
	if (query) {
		res = await fetch(`https://ponybooru.org/api/v1/json/search/images?q=${query}`);
		const { images } = await res.json();
		if (images[0]) {
			const { view_url, tags } = images[images.length - 1];
			post = {...post, view_url, tags };
		}
	}
	return post;
}

async function r34_search(tags) {
	post = {file_url: '', tags: []};
	res = await fetch(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=100&tags=${tags}`);
	xlmtext = await res.text();
	parseString(xlmtext, (err, result) => {
		posts = result.posts.post;
		if (posts) {
			const { file_url, tags } = posts[Math.floor(Math.random() * posts.length)]['$'];
			post.file_url = file_url;
			post.tags = tags.split(' ');
		}
	});
	return post;
}

module.exports = { delay, youtube_search, get_piada, pony_search, r34_search };