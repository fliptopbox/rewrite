const isenglish = /^en-(gb|us)/i;

let english;
let retry;
let synth, voices;
let selectedVoice = null;

function initialize() {
  synth = window.speechSynthesis;

  if (synth && !synth.getVoices()) {
    console.warn("retry snth reloading");
    retry && clearTimeout(retry);
    retry = setTimeout(initialize, 150);
    return retry;
  }

  voices = synth.getVoices();
  let i = 0;

  english = voices.filter((item, n) => {
    if (isenglish.test(item.lang)) {
      console.log(i++, n, item.lang, item.name, item.default);
      if (item.default) selectedVoice = item;
      return true;
    }
  });

  selectedVoice = selectedVoice || english[0];
  console.log("selected voice", selectedVoice);
  return methods;
}

function setVoice(i = 0) {
  selectedVoice || initialize();
  selectedVoice = english[i];
  console.log(selectedVoice.name, selectedVoice.lang);
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
  console.log("%s) %s", n, voice.name, tts.text);
  return synth.speak(tts);
}

function textToSpeech(array, period = "") {
  if (!array) return;

  let text = array.constructor === Array ? array : array.split("\n");
  text = text.filter(s => String(s || "").trim());
  text.forEach((s, n) => saythis(`${s}${period}`, n));
}

// document.querySelector("button").onclick = textToSpeech;
const methods = {
  say: saythis,
  read: textToSpeech,
  voice: setVoice
};
window.TTS = methods;

export default initialize;
