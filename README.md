# Read with Your Voice (Front-end)

Read with Your Voice is a website that allows users to record their own voice in [Toki Pona language](http://tokipona.org/). After recording the voice, it's able to synthesize arbitrary Toki Pona text.

This repository contains the front-end of this project. [The repo of the back-end of this project is available here](https://github.com/SadaleNet/ReadWithYourVoiceApi).

# Live Demo

Live demo is available here: [https://voice.sadale.net](https://voice.sadale.net)

# Demonstration Video

Couldn't figure out how to use the site? Check out this video! [https://youtu.be/oV5kHIu6AVc](https://youtu.be/oV5kHIu6AVc)

# Creating New Voice

## Theory

The idea is simple. Toki Pona is a language that has less than 130 words. To make text-to-speech of arbitrary voice work, the user would just need to record 25 sentences that contains all of the words. After that, the server would split the audio clips of each sentence into audio clips containing individual words. Then the text-to-speech engine of the website would make use of the user-provided text to generate a speech by playing the existing audio clips of words in sequence.

Please notice that additional syllables would be required to be recorded if the text contains non-standard words. This includes name of people, name of places and loan words.

## Procedure

To create a new voice, the following procedure can be performed:

1. Use the "Start Recording" button on the website to create a new voice. Fill in the metadata there, including the pitch of stressed and unstressed syllables and the duration of each syllable.
2. A link will be shown for future modification of the voice. Save the link for future modification.
3. Start recording! After pressing the "Record" button, assistive melody and beat would be played. Sing along the melody and beat as if you're in karaoke. After that, press the "Play" button to test the voice and press "Next" to record the next sentence. Repeat until you're done. If you aren't interested in synthesizing non-official words, it isn't required to record the syllables.
4. After you're done, switch to the text-to-speech page and you can test with the voice.
5. There're two links shown on the page. One of the link is used for modification of voice. Do **not** share that link. Instead, share the one that's used for text-to-speech without modification privilege. After that, whoever having access to the link would be able to use the text-to-speech with your voice! :)

## Tips for Quality Recording

* Get a headset or earphone. It's highly recommended. Otherwise the assistive melody and beat would get recorded along with the human voice.
* When you're recording, do not do it as if you're talking. Do it as if you're singing in karaoke. Try following the pitch and timing of the assistive melody as close as possible. The pitch is especially important. If the timing is a bit off, it's often ok because the server would automatically trim out the silence of the audio.
* Ensure that there's a clear separation when you're pronouncing each word. For example, if the webpage shows "o kepeken telo moli lon ma ali ni", you'd have to pronounce it as if it's "o. kepeken. telo. moli. lon. ma. ali. ni."
	* The separation is used for the server to remove the silent part of the audio clip. Without the separation, there would not be any silence. As server-side silence removal is used for of adjusting the timing of the audio clips, no silence would cause timing adjustment to fail. This would make the timing of the audio clips sound off.
* Some consonants take longer time to pronounce, including n and m. You may want to try reducing the transition time by try pronouncing these words with shorter n and m. Otherwise the word timing may go a bit off.

# Technical Notes

The front-end of this website is a single-page website developed using ReactJS Javascript framework.

The front-end of this project includes the distribution of [opus-recorder](https://github.com/chris-rudmin/opus-recorder).

The back-end is a Node.js script with ExpressJS framework.

# Configuration

The configuration is available in src/private/config.json. It contains two parameters:

`captchaKey` is the recaptcha key. It isn't the secret key. The secret key should be configured on the server side. If captcha isn't needed, `captchaKey` should be removed from the configuration file.

`apiEndPoint` is the URL to the API. For example, it can be `http://localhost:3001`

`dataEndPoint` is the URL to the assets server for the public voice clips and metadata. For example, it can be `http://localhost:3001`

# Development

To perform development, run `yarn install` and `yarn start`. After that, open `http://localhost:3000` to start the development.

Any files modified will get updated immediately during the development.

# Deployment

To perform deployment, run `yarn install` and `yarn build`. After that, the content inside the build directory can be served with any HTTP server, such as nginx, apache or lighttpd.

Please notice that this website doesn't work without a back-end API server. Please refer to the README file of repository of the back-end on how to setup one.

Keep in mind that there's a "Terms of Service and Privacy Policy" located in ./src/private/tos.txt. If you're hosting an instance of this website, you'd have to agree with the terms as an "operator". If you do not agree with the terms, modify the text inside the Terms of Service file before the deployment!

I wrote the "Terms of Service and Privacy Policy" myself. I'm not a lawyer. I'm not liable for any potential damage caused if you're hosting this website using the "Terms of Service and Privacy Policy" that I've written.

# Known Issue

For the ease of use of the website, anyone having access to the link that contains the token of modification of the voice would be able to modify the voice. This can be a major security risk if the voice were recorded in a public machine because anyone would be able to modify the voice just by using the browser history.

With this design, the users are able to create a new voice without registering any account or memorizing any password! As it doesn't make sense to perform the recording on public computer, the ease of use outweighs the potential security risk. If registration were required to create a new voice, there'd be far less users willing to contribute their voice.

# License

This project is mostly released under BSD 2-clause license. Please notice that this repository includes third party libraries that is distributed under their own license. Particularly a distribution of opus-recorder is included in this repository. In addition, some sample articles included in the website are copyrighted by their author. They are used for this project with the permission from the authors.

# Remarks

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
