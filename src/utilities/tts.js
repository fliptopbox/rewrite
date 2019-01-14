const isenglish = /^en-(gb|us)/i;

let english;
let retry;
let synth, voices;
let selectedVoice = null;

function initialize() {
  synth = window.speechSynthesis;
  voices = synth.getVoices();

  if (!voices) {
    // console.warn("Voices not loaded. Reloading");
    retry && clearTimeout(retry);
    retry = setTimeout(initialize, 150);
    return retry;
  }

  let i = 0;
  let index = null;

  voices.forEach((item, n) => {
    if (isenglish.test(item.lang)) {
      if (index === null && /female/i.test(item.name)) {
        index = i;
      }
      english = english || [];
      english.push(item);
      i++;
    }
  });

  // console.log("TTS initialized", english && english.length, index);
  selectedVoice = english && english[index || 0];

  window.speechSynthesis.onvoiceschanged = function(e) {
    console.log("voice has chagned", e.timeStamp);
  };

  return methods;
}

function setVoice(i = 0) {
  (english && english.length) || initialize();
  selectedVoice = english[i];
  return selectedVoice;
}

function saythis(text, n = "") {
  // const text = monologue.slice(0,1);
  const tts = new SpeechSynthesisUtterance();
  const voice = selectedVoice || null;

  if (!voice) {
    return setTimeout(() => {
      console.warn("Say this is not ready. Reloading.");
      initialize();
      saythis(text, n);
    }, 350);
  }

  Object.assign(tts, {
    volume: 1,
    pitch: 1,
    rate: 1,
    voice,
    text
  });
  return synth.speak(tts);
}

function textToSpeech(array, period = "") {
  // this is a toggle function
  // if it is already spleaking it stop
  // otherwise it sets up and starts to read;

  if (synth.speaking) return synth.cancel();
  if (!array) return;

  let text = array.constructor === Array ? array : array.split("\n");
  text = text.filter(s => String(s || "").trim());
  text.forEach((s, n) => saythis(`${s}${period}`, n));
}

const methods = {
  say: saythis,
  read: textToSpeech,
  voice: setVoice,
  speaking: () => window.speechSynthesis.speaking,
  cancel: () => window.speechSynthesis.cancel()
};

window.TTS = methods;

export default initialize;
