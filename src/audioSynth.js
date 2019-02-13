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

let wordList = ["a", "akesi", "ala", "alasa", "ale", "ali", "anpa", "ante", "anu", "awen", "e", "en", "esun", "ijo", "ike", "ilo", "insa", "jaki", "jan", "jelo", "jo", "kala", "kalama", "kama", "kasi", "ken", "kepeken", "kili", "kin", "kiwen", "ko", "kon", "kule", "kulupu", "kute", "la", "lape", "laso", "lawa", "len", "lete", "li", "lili", "linja", "lipu", "loje", "lon", "luka", "lukin", "lupa", "ma", "mama", "mani", "meli", "mi", "mije", "moku", "moli", "monsi", "mu", "mun", "musi", "mute", "namako", "nanpa", "nasa", "nasin", "nena", "ni", "nimi", "noka", "o", "oko", "olin", "ona", "open", "pakala", "pali", "palisa", "pan", "pana", "pi", "pilin", "pimeja", "pini", "pipi", "poka", "poki", "pona", "pu", "sama", "seli", "selo", "seme", "sewi", "sijelo", "sike", "sin", "sin", "sina", "sinpin", "sitelen", "sona", "soweli", "suli", "suno", "supa", "suwi", "tan", "taso", "tawa", "telo", "tenpo", "toki", "tomo", "tu", "unpa", "uta", "utala", "walo", "wan", "waso", "wawa", "weka", "wile", "apeja", "monsuta", "kipisi", "pata", "leko"];
let audioList = {};
let stressedFrequency;
let unstressedFrequency;
let syllableDuration;
let fileSeparationDuration;

let previousWordStartTime;

//TODO: use .addEventListener('canplaythrough', isAppLoaded, false); to check if all audio had been loaded

function loadAudio(path, config){
	stressedFrequency = config.stressedFrequency;
	unstressedFrequency = config.unstressedFrequency;
	syllableDuration = config.syllableDuration;
	fileSeparationDuration = config.fileSeparationDuration;
	if(!path){
		audioList = wordList.map(x => null);
		return;
	}
	audioList = wordList.map((x) => {
		return new Audio(`${path}/${x}.ogg`) || null;
	});
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
	let currentWord;

	if(wordList.indexOf(message[0]) != -1){ //Official word
		currentWord = message[0];
		message = message.slice(1)
	}else{ //Unofficial word! We're taking the first syllable as a "word".
		//Extracts the first syllable. (?=) is a look-ahead operation. See https://stackoverflow.com/a/3926546
		const firstSyllable = message[0].match(/^[kptnmsjwl]?[aeiou](n(?=([^aeiou]|$)))?/gi)[0];
		currentWord = firstSyllable + (firstSyllablePlayed ? '_' : '-');
		firstSyllablePlayed = true;
		message[0] = message[0].slice(firstSyllable.length);
		if(message[0].length === 0){
			message = message.slice(1);
			firstSyllablePlayed = false;
		}
	}

	//Play the audio
	const numVowel = currentWord.match(/[aeiou]/gi).length;
	if(!recordMode && audioList[wordList.indexOf(currentWord)]){ //Audio clip available
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
			previousWordStartTime + syllableDuration*numVowel + fileSeparationDuration);
		previousWordStartTime += syllableDuration*numVowel+fileSeparationDuration;
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
	message = message.replace(/[^A-Za-z\-_]+/g, " ");
	let wordsQueue = message.split(" ").filter(word => word.length > 0);
	stopPlayingNow = false;
	previousWordStartTime = null;
	if(!recordMode){
		playNextWord(wordsQueue, audioPlayEndCallback, recordMode);
	}else{
		previousWordStartTime = (new Date()).getTime();
		for(let i=0; i<8; i++)
			setToHappen(() => playBeat(), previousWordStartTime+syllableDuration*i);
		setToHappen(() => playNextWord(wordsQueue, audioPlayEndCallback, recordMode), previousWordStartTime+syllableDuration*8);
		previousWordStartTime += syllableDuration*8;
	}
}

exports.loadAudio = loadAudio;
exports.playSentence = playSentence;
exports.stopPlaying = stopPlaying;
