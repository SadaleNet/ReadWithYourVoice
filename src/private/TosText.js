/*
Copyright 2019 Wong Cho Ching <https://sadale.net>

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

//This is the default Terms of Service and Privacy Policy. If you're hosting an instance of this website, please adapt it as needed.

const text = `
Terms of Service and Privacy Policy of "Read with Your Voice"

0. Definition
0.1. "This website" is defined as the front-end of "Read with Your Voice" and the server software that is providing the back-end API service of "Read with Your Voice".
0.2. "Developer(s)" is defined as author(s) who was involved in creation and modification of the source code of this website.
0.3. "Operator(s)" is defined as individual(s) who host an instance of this website by utilizing the source code developed by the developer(s).
0.4. "User-created content" is defined as any user-created data stored in this website as well as the new data generated that is used for working with user-created data. This includes, but not limited to text-based data, recorded audio clips, audio clips generated based on the recorded audio clips, name of the voice, the access token and numeric values entered to this website.
0.5. "Content creator(s)" is defined as individual(s) who uploaded the user-created content using this website.
0.6. "Voice" is defined as a set of user-created content that is used for the text-to-speech engine of this website for generating speech based on the text provided.

1. Disclaimer
1.1. This website is provided "as is" and any express or implied warranties are disclaimed. The developer(s) and operator(s) of this website assume no liability of any damaged caused in case of any malfunction of this website.

2. Responsible Parties
2.1. It is the responsibility of the user who created the voice to ensure that any content creator(s) who is modifying his/her voice agree with this Terms of Service and Privacy Policy.
2.2. The content creator(s) is responsible for the potential dispute caused by the uploaded user-created content using this website.
2.3. The source code of this website is publicly available. Therefore, it is possible for anyone to host an instance of this website. In case of dispute, the operator(s) of the instance of this website is responsible for handling it. The developer(s) of this website assumes no liability for any damage caused.

3. Privacy Policy
3.1. To ensure the functionality of this website, user-created content may be uploaded during the normal operation of this website.
3.2. The text-based user-created content provided to this website will be stored on the server and will be made available to anyone who has access to the URL to the webpage of the particular voice or the URL to the metadata file of the particular voice.
3.3. Two variants of recorded audio clips, which are user-created content, will be stored on the server, which includes the raw recorded audio clips and the processed audio clips.
3.3.1. Under ordinary circumstances, each processed audio clip contains the voice of a word or a syllable. The processed audio clips are used for keeping the text-to-speech engine of this website functional. Therefore, they are publicly accessible to anyone who has access to the URL to the webpage of the particular voice or the URL(s) to the particular voice files.
3.3.2. The raw recorded audio clips are stored on the server for two purposes. They are potential regeneration of processed audio clips upon modification of voice processing algorithm and potential research purpose.
3.3.2.1. As for regeneration of processed audio clips upon modification of voice processing algorithm, if the aforementioned algorithm is updated, the operator(s) reserves the right to regenerate the processed audio clips with the updated voice processing algorithm.
3.3.2.2. As for potential research purpose, the operator(s) of this website will not proactively redistribute the raw audio clips to any third party. However, the operator(s) of this website reserves the right of sharing the anonymized data about the audio clips as well as the aggregated statistics of the data generated based on the collected audio clips to the public.
3.4. To facilitate debugging of server issues, server-side logging is enabled. The operator(s) will not proactively redistribute the logs to any third party.
3.5. For the user-created content that the operator(s) will not proactively redistribute to any third party, there is a possibility that the user-created content would be leaked to third party by other means. This includes, but not limited to: a) the provider of the server(s) hosting this website may intentionally, or unintentionally redistribute the stored user-created content resides on the servers b) the user-created content stored on the servers were accessed by the mean of security exploit(s). c) user-created content could be made public due to malfunction of this website. In event of user-created content being made available that is not caused by the operator(s) proactively sharing the user-created content, the operator(s) of this website assumes no liability on any damage caused.
3.6. Under the condition that the requirements of this terms of service and privacy policy are met, the operator(s) of this website is allowed to use the user-created content for any purpose.
3.7. Depending on the configuration, reCAPTCHA may be integrated into this website, which is a third party service. The operator(s) of this website assumes no liability in case of privacy intrusion or any damage caused by any third party service integrated into this website.
`;

exports.text = text;
