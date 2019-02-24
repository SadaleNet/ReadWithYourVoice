/*
Copyright 2019 Wong Cho Ching <https://sadale.net>

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const assistiveVoiceGain = 0.25;

//Adapted from https://stackoverflow.com/a/44215748 and http://teropa.info/blog/2016/08/30/amplitude-and-loudness.html
	let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	function playNote(frequency, duration) {
		duration = duration / 1000;

		// create Oscillator node
		var oscillator = audioCtx.createOscillator();

		oscillator.type = 'square';
		oscillator.frequency.value = frequency; // value in hertz

		let gain = audioCtx.createGain();
		gain.gain.value = assistiveVoiceGain*0.5;
		
		oscillator.connect(gain);
		gain.connect(audioCtx.destination);

		oscillator.start(0);
		oscillator.stop(audioCtx.currentTime + duration);
	}

//Adapted from https://stackoverflow.com/a/781019
function setToHappen(fn, d){
    var t = d - (new Date()).getTime();
    return setTimeout(fn, t);
}

let wordList = ["a", "akesi", "ala", "alasa", "ale", "ali", "anpa", "ante", "anu", "awen", "e", "en", "esun", "ijo", "ike", "ilo", "insa", "jaki", "jan", "jelo", "jo", "kala", "kalama", "kama", "kasi", "ken", "kepeken", "kili", "kin", "kiwen", "ko", "kon", "kule", "kulupu", "kute", "la", "lape", "laso", "lawa", "len", "lete", "li", "lili", "linja", "lipu", "loje", "lon", "luka", "lukin", "lupa", "ma", "mama", "mani", "meli", "mi", "mije", "moku", "moli", "monsi", "mu", "mun", "musi", "mute", "namako", "nanpa", "nasa", "nasin", "nena", "ni", "nimi", "noka", "o", "oko", "olin", "ona", "open", "pakala", "pali", "palisa", "pan", "pana", "pi", "pilin", "pimeja", "pini", "pipi", "poka", "poki", "pona", "pu", "sama", "seli", "selo", "seme", "sewi", "sijelo", "sike", "sin", "sin", "sina", "sinpin", "sitelen", "sona", "soweli", "suli", "suno", "supa", "suwi", "tan", "taso", "tawa", "telo", "tenpo", "toki", "tomo", "tu", "unpa", "uta", "utala", "walo", "wan", "waso", "wawa", "weka", "wile", "apeja", "monsuta", "kipisi", "pata", "leko", 
"a-","a_","e-","e_","i-","i_","o-","o_","u-","u_",
"an-","an_","en-","en_","in-","in_","on-","on_","un-","un_",
"pa-","pa_","pe-","pe_","pi-","pi_","po-","po_","pu-","pu_",
"pan-","pan_","pen-","pen_","pin-","pin_","pon-","pon_","pun-","pun_",
"ta-","ta_","te-","te_","ti-","ti_","to-","to_","tu-","tu_",
"tan-","tan_","ten-","ten_","tin-","tin_","ton-","ton_","tun-","tun_",
"ka-","ka_","ke-","ke_","ki-","ki_","ko-","ko_","ku-","ku_",
"kan-","kan_","ken-","ken_","kin-","kin_","kon-","kon_","kun-","kun_",
"sa-","sa_","se-","se_","si-","si_","so-","so_","su-","su_",
"san-","san_","sen-","sen_","sin-","sin_","son-","son_","sun-","sun_",
"ma-","ma_","me-","me_","mi-","mi_","mo-","mo_","mu-","mu_",
"man-","man_","men-","men_","min-","min_","mon-","mon_","mun-","mun_",
"na-","na_","ne-","ne_","ni-","ni_","no-","no_","nu-","nu_",
"nan-","nan_","nen-","nen_","nin-","nin_","non-","non_","nun-","nun_",
"la-","la_","le-","le_","li-","li_","lo-","lo_","lu-","lu_",
"lan-","lan_","len-","len_","lin-","lin_","lon-","lon_","lun-","lun_",
"wa-","wa_","we-","we_","wi-","wi_","wo-","wo_","wu-","wu_",
"wan-","wan_","wen-","wen_","win-","win_","won-","won_","wun-","wun_",
"ja-","ja_","je-","je_","ji-","ji_","jo-","jo_","ju-","ju_",
"jan-","jan_","jen-","jen_","jin-","jin_","jon-","jon_","jun-","jun_"];

let audioList = {};
let audioBasePath = "";
let stressedFrequency;
let unstressedFrequency;
let syllableDuration;
let fileSeparationDuration;

let previousWordStartTime;

function audioLoadedHandlerFactory(targetCalledNum, loadedCallback){
	let numAudioLoaded = 0;
	return () => {
		if(++numAudioLoaded >= targetCalledNum && loadedCallback)
			loadedCallback();
	};
}

function createAudio(path, audioLoaded){
	let audio = new Audio();
	if(audioLoaded){
		audio.addEventListener('canplaythrough', audioLoaded);
		audio.addEventListener('error', audioLoaded);
	}
	audio.preload = "auto";
	audio.src = path;
	audio.load();
	return audio;
}

function loadAudio(path, config, loadedCallback){
	stressedFrequency = config.stressedFrequency;
	unstressedFrequency = config.unstressedFrequency;
	syllableDuration = config.syllableDuration;
	fileSeparationDuration = config.fileSeparationDuration;
	audioBasePath = path;
	
	const queryString = config.reload ? `?${new Date().getTime()}` : "";

	if(!audioBasePath){
		audioList = wordList.map(x => null);
		return;
	}

	//The +1 is for the beat.ogg
	const audioLoaded = audioLoadedHandlerFactory(wordList.length+1, loadedCallback);

	//Load the beat ogg file. Load it before loading anything else because 'canplaythrough' event isn't very reliable.
	createAudio(require('./assets/beat.ogg'), audioLoaded);

	audioList = [];
	for(let word of wordList){
		audioList.push(
			createAudio(`${audioBasePath}/${word}.ogg${queryString}`, audioLoaded)
		);
	}
}

function reloadAudio(words, loadedCallback){
	const audioLoaded = audioLoadedHandlerFactory(words.length, loadedCallback);
	for(let word of words){
		//The Math.random() is used for forcing the website to reload the audio. It prevents caching so that the newly recorded audio would get "updated" to the browser immediately
		audioList[wordList.indexOf(word)] =
			createAudio(`${audioBasePath}/${word}.ogg?${new Date().getTime()}`, audioLoaded);
	}
}


function reconfigAudio(config){
	if("stressedFrequency" in config)
		stressedFrequency = config.stressedFrequency;
	if("unstressedFrequency" in config)
		unstressedFrequency = config.unstressedFrequency;
	if("syllableDuration" in config)
		syllableDuration = config.syllableDuration;
	if("fileSeparationDuration" in config)
		fileSeparationDuration = config.fileSeparationDuration;
}

let stopPlayingNow;
function stopPlaying(){
	stopPlayingNow = true;
}

function playBeat(){
	const audio = new Audio(require('./assets/beat.ogg'));
	audio.volume = assistiveVoiceGain;
	audio.play();
}

let firstSyllablePlayed = false;
function playNextWord(message, audioPlayEndCallback, recordMode=false){
	if(stopPlayingNow){
		stopPlayingNow = false;
		if(!recordMode &&audioPlayEndCallback)
			audioPlayEndCallback();
		return;
	}

	if(!message.length){
		if(!recordMode){
			if(audioPlayEndCallback)
				audioPlayEndCallback();
		}else{
			for(let i=0; i<4; i++)
				setToHappen(() => playBeat(), previousWordStartTime+syllableDuration*i);
			if(audioPlayEndCallback)
				setToHappen(() => audioPlayEndCallback(), previousWordStartTime+syllableDuration*4);
			previousWordStartTime += syllableDuration*4;
		}
		return;
	}
	let fileSeparationMultiplier = 1.0;
	let punctuation = '';

	if(message[0].match(/[,.:!?]$/g)){
		fileSeparationMultiplier = 3.0;
		punctuation = message[0].slice(-1);
		message[0] = message[0].slice(0, -1);
	}

	let currentWord;

	if(!firstSyllablePlayed && wordList.indexOf(message[0]) !== -1){ //Official word
		currentWord = message[0];
		message = message.slice(1);
	}else{ //Unofficial word! We're taking the first syllable as a "word".
		if(message[0].match(/^[kptnmsjwl]?[aeiou]n?[-_]/gi)){
			//It's a syllable like "jan-". We can use it without additional processing
			currentWord = message[0];
			message = message.slice(1);
		}else{ 
			//Extracts the first syllable. (?=) is a look-ahead operation. See https://stackoverflow.com/a/3926546
			function extractFirstSyllable(text){
				return text.toLowerCase().match(/[kptnmsjwl]?[aeiou](n(?=([^aeiou]|$)))?/gi);
			}
			const match = extractFirstSyllable(message[0]);
			if(match){
				const firstSyllable = match[0];
				currentWord = firstSyllable + (firstSyllablePlayed ? '_' : '-');
				firstSyllablePlayed = true;
				message[0] = message[0].slice(message[0].toLowerCase().indexOf(firstSyllable)+firstSyllable.length)+punctuation;
				if(!extractFirstSyllable(message[0])){
					message = message.slice(1);
					firstSyllablePlayed = false;
				}else{
					fileSeparationMultiplier = 0.5;
				}
			}else{
				//No more valid syllable in this word.
				firstSyllablePlayed = false;
				setTimeout(() => playNextWord(message.slice(1), audioPlayEndCallback, recordMode), 0);
				return;
			}
		}
	}

	//Play the audio
	const numVowel = currentWord.match(/[aeiou]/gi).length;
	if(!recordMode && audioList[wordList.indexOf(currentWord)]
		&& !audioList[wordList.indexOf(currentWord)].error){ //Audio clip available
		const audio = new Audio(audioList[wordList.indexOf(currentWord)].src);
		audio.play();
	}else{ //Audio clip not available. Playing square wave instead.
		if(numVowel===1 && currentWord.endsWith('_')){
			playNote(unstressedFrequency, syllableDuration);
		}else{
			//Play the first syllable immediately
			playNote(stressedFrequency, syllableDuration);
			//Queue the remaining syllables to be played later
			const playUnstressedNote = () => playNote(unstressedFrequency, syllableDuration)
			for(let i=1; i<numVowel; i++)
				setToHappen(playUnstressedNote, previousWordStartTime+syllableDuration*i);
		}
	}

	//Calculate when to play the next word
	if(!recordMode){
		setToHappen(() => playNextWord(message, audioPlayEndCallback, recordMode),
			previousWordStartTime + syllableDuration*numVowel + fileSeparationDuration*fileSeparationMultiplier);
		previousWordStartTime += syllableDuration*numVowel+fileSeparationDuration*fileSeparationMultiplier;
	}else{
		if(numVowel<=2){
			for(let i=numVowel; i<4; i++)
				setToHappen(() => playBeat(), previousWordStartTime+syllableDuration*i);
			setToHappen(() => playNextWord(message, audioPlayEndCallback, recordMode), previousWordStartTime+syllableDuration*4);
			previousWordStartTime += syllableDuration*4;
		}else{ //3 syllables is assumed.
			for(let i=numVowel; i<6; i++)
				setToHappen(() => playBeat(), previousWordStartTime+syllableDuration*i);
			setToHappen(() => playNextWord(message, audioPlayEndCallback, recordMode), previousWordStartTime+syllableDuration*6);
			previousWordStartTime += syllableDuration*6;
		}
	}
}

function playSentence(message, audioPlayEndCallback, recordMode=false){
	message = message.replace(/[^A-Za-z\-_,.:!?]+/g, " ")
		.replace(',', ', ').replace('.', '. ').replace(':', ': ').replace('!', '! ').replace('?', '? ');
	let wordsQueue = message.split(" ").filter(word => word.length > 0);
	stopPlayingNow = false;
	firstSyllablePlayed = false;
	previousWordStartTime = (new Date()).getTime();
	if(!recordMode){
		playNextWord(wordsQueue, audioPlayEndCallback, recordMode);
	}else{
		previousWordStartTime += syllableDuration; //Delay all sounds by a syllableDuration.
		for(let i=0; i<8; i++)
			setToHappen(() => playBeat(), previousWordStartTime+syllableDuration*i);
		setToHappen(() => playNextWord(wordsQueue, audioPlayEndCallback, recordMode), previousWordStartTime+syllableDuration*8);
		previousWordStartTime += syllableDuration*8;
	}
}

exports.loadAudio = loadAudio;
exports.reconfigAudio = reconfigAudio;
exports.reloadAudio = reloadAudio;
exports.playSentence = playSentence;
exports.stopPlaying = stopPlaying;
