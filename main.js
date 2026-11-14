const naturalNotes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const sharpNotes = ['A#', 'B#', 'C#', 'D#', 'E#', 'F#', 'G#'];
const flatNotes = ['Ab', 'Bb', 'Cb', 'Db', 'Eb', 'Fb', 'Gb'];
const allNotes = [...naturalNotes, ...sharpNotes, ...flatNotes];

const stringSpace = '-----';

const frets = {};
frets['A'] = [5, 12, 7, 2, 10, 5];
frets['B'] = [7, 2, 9, 4, 12, 7];
frets['C'] = [8, 3, 10, 5, 1, 8];
frets['D'] = [10, 5, 12, 7, 3, 10];
frets['E'] = [12, 7, 2, 9, 5, 12];
frets['F'] = [1, 8, 3, 10, 6, 1];
frets['G'] = [3, 10, 5, 12, 8, 3];

frets['A#'] = sharpTheNote('A');
frets['B#'] = sharpTheNote('B');
frets['C#'] = sharpTheNote('C');
frets['D#'] = sharpTheNote('D');
frets['E#'] = sharpTheNote('E');
frets['F#'] = sharpTheNote('F');
frets['G#'] = sharpTheNote('G');

frets['Ab'] = flatTheNote('A');
frets['Bb'] = flatTheNote('B');
frets['Cb'] = flatTheNote('C');
frets['Db'] = flatTheNote('D');
frets['Eb'] = flatTheNote('E');
frets['Fb'] = flatTheNote('F');
frets['Gb'] = flatTheNote('G');

const ordinalMap = [
  'zeroeth',
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelfth',
];

const metronomeBpm = getEl('metronome-bpm');
const metronomeButton = getEl('metronome-button');
const metronomeSlower = getEl('metronome-slower');
const metronomeFaster = getEl('metronome-faster');

const ex1Random = getEl('ex1-random');
const ex1Input = getEl('ex1-input');
const ex1Go = getEl('ex1-go');
const ex1Natural = getEl('ex1-natural');
const ex1Sharp = getEl('ex1-sharp');
const ex1Flat = getEl('ex1-flat');

const ex4GetTwoRandom = getEl('ex4-get-two-random');
const ex4Accidentals = getEl('ex4-accidentals');

const ex5GetSevenRandom = getEl('ex5-get-seven-random');

const radioFind = getEl('find-note');
const radioName = getEl('name-note');
const radioRandom = getEl('find-or-name');
const flashCardButton = getEl('flash-card-button');
const flashCardInstructions = getEl('flash-card-instructions');
const flashCardHint = getEl('flash-card-hint');
const flashCardAudio = getEl('flash-card-audio');
const flashCardDurationInput = getEl('flash-card-duration');
const flashCardTimerBar = getEl('flash-card-timer-bar');
const stringAllCheckbox = getEl('string-all');
const stringCheckboxes = document.querySelectorAll('.string-checkbox');
const notesNaturalCheckbox = getEl('notes-natural');
const notesSharpCheckbox = getEl('notes-sharp');
const notesFlatCheckbox = getEl('notes-flat');

const voice = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance('hello, world');

radioFind.checked = true;

let metronomeOn = false;
let interval = bpmToInterval(40);
let target = Date.now();

let metronomeActivated = false;
let metronomeAudioElement = null;

let vocalizeFlashCards = false;
let flashCardDuration = 10000;
let flashCardInterval = null;

const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

ex1Natural.checked = true;
stopMetronome();

if (deviceIsIos()) {
  getEl('metronome').innerHTML = '<h3 style="color: #444444">You appear to be using an iOS device.</h3><h3 style="color: #444444">Normally, a metronome tool would appear here.  Due to technical limitations, this feature is only available on desktop/laptop.  But a metronome is highly recommended for these exercises, and can be found on other mobile apps and websites!!</h3>';
}

function randInt (maxExclusive) {
  return Math.floor(Math.random() * maxExclusive);
}

function getEl (id) {
  return document.getElementById(id);
}

function bpmToInterval (bpm) {
  const bps = bpm / 60;
  const ms = 1000 / bps;
  console.log(`converted ${bpm} bpm to ${ms} ms`);
  return ms;
}  

function enforceMetronomeRules () {
  let value = parseInt(metronomeBpm.value);
  if (isNaN(value)) value = 60;
  if (value < 30) value = 30;
  if (value > 350) value = 350;
  metronomeBpm.value = value;
  interval = bpmToInterval(value);
}

function startMetronome () {
  metronomeAudioElement.loop = false;
  metronomeAudioElement.play();
  target = Date.now() + interval;
  metronomeOn = true;
}
function stopMetronome () {
  metronomeOn = false;
}

function handleMetronomeStartStop () {
  if (!metronomeActivated) {
    metronomeActivated = true;
    metronomeAudioElement = new Audio('tick.mp3');
  }

  if (metronomeOn) {
    return stopMetronome();
  }

  startMetronome();
}

function handleMetronomeUpdate () {
  enforceMetronomeRules();
  if (metronomeOn) {
    stopMetronome();
    startMetronome();
  }
}

function sharpTheNote (note) {
  return frets[note].map(fret => {
    if (fret === 12) return 1;
    return fret + 1;
  })
}
function flatTheNote (note) {
  return frets[note].map(fret => {
    if (fret === 1) return 12;
    return fret - 1;
  })
}

function getRandomNote (nats = true, sharps = false, flats = false) {
  const options = [];
  if (nats) options.push(...naturalNotes);
  if (sharps) options.push(...sharpNotes);
  if (flats) options.push(...flatNotes);

  return options[randInt(options.length)];
}

function getStringsByNote (note, startFirstString = false) {
  let fretList = Array.from(frets[note]);
  if (startFirstString) {
    fretList.reverse();
    console.log('reverse requested, reversing fret order');
  }
  let stringList = fretList.map((fret, index) => {
    fret = fret + '';
    while (fret.length < stringSpace.length) {
      fret = `-${fret}`;
    }
    let stringString = '';
    for (let string = 0; string < 6; string++) {
      if (string === index) stringString += fret;
      else stringString += stringSpace;
    }
    return stringString;
  });
  if (startFirstString) {
    console.log('reverse requested, reversing string order');
    stringList.reverse();
  }
  return stringList;
}

metronomeButton.addEventListener('click', handleMetronomeStartStop);

metronomeSlower.addEventListener('click', () => {
  let value = parseInt(metronomeBpm.value);
  value -= 5;
  if (value % 5 !== 0) {
    value += (5 - (value % 5));
  }
  metronomeBpm.value = value;
  handleMetronomeUpdate();
});
metronomeFaster.addEventListener('click', () => {
  let value = parseInt(metronomeBpm.value);
  value += 5;
  if (value % 5 !== 0) {
    value -= (value % 5);
  }
  metronomeBpm.value = value;
  handleMetronomeUpdate();
});

metronomeBpm.addEventListener('blur', () => {
  handleMetronomeUpdate();
});

ex1Random.addEventListener('click', () => {
  let note = getRandomNote(ex1Natural.checked, ex1Sharp.checked, ex1Flat.checked);
  while (ex1Input.value == note) note = getRandomNote(ex1Natural.checked, ex1Sharp.checked, ex1Flat.checked);
  ex1Input.value = note;

  let strings = getStringsByNote(note, getEl('ex1-reverse-randomly').checked ? randInt(2) : getEl('ex1-reverse').checked);
  let stringDivs = [
    getEl('ex1-string1'),
    getEl('ex1-string2'),
    getEl('ex1-string3'),
    getEl('ex1-string4'),
    getEl('ex1-string5'),
    getEl('ex1-string6')
  ];

  stringDivs.forEach((div, index) => {
    div.innerHTML = strings[index];
  });
});

ex1Go.addEventListener('click', () => {
  let input = ex1Input.value;
  if (!frets[input]) return alert(`Invalid note!  Only natural notes A through G, sharps written as "C#", and flats written as "Cb" are accepted.  Check your capitalization!`);

  let strings = getStringsByNote(input, getEl('ex1-reverse').checked);
  let stringDivs = [
    getEl('ex1-string1'),
    getEl('ex1-string2'),
    getEl('ex1-string3'),
    getEl('ex1-string4'),
    getEl('ex1-string5'),
    getEl('ex1-string6')
  ];

  stringDivs.forEach((div, index) => {
    div.innerHTML = strings[index];
  });
});

ex4GetTwoRandom.addEventListener('click', () => {
  let note1 = ex4Accidentals.checked ? getRandomNote(true, true, true) : getRandomNote(true);
  let note2 = ex4Accidentals.checked ? getRandomNote(true, true, true) : getRandomNote(true);
  ex1Input.value = `${note1} ${note2}`;

  let strings1 = getStringsByNote(note1, false);
  let strings2 = getStringsByNote(note2, true);
  let stringDivs = [
    getEl('ex1-string1'),
    getEl('ex1-string2'),
    getEl('ex1-string3'),
    getEl('ex1-string4'),
    getEl('ex1-string5'),
    getEl('ex1-string6')
  ];

  stringDivs.forEach((div, index) => {
    div.innerHTML = `${strings1[index]}${strings2[index]}`;
  });
});

ex5GetSevenRandom.addEventListener('click', () => {
  const notes = Array.from(naturalNotes);
  const randomed = [];
  while (notes.length) {
    randomed.push(notes.splice(randInt(notes.length), 1)[0]);
  }
  getEl('ex5-notes').innerHTML = randomed.join(' - ');
});

setInterval(() => {
  if (metronomeOn) {
    const now = Date.now();
    if (now >= target) {
      metronomeAudioElement.loop = false;
      metronomeAudioElement.currentTime = 0;
      metronomeAudioElement.play();
      target = now + interval;
    }
  }
}, 10);

// do a flash card
function startFlashCardInterval() {
  if (flashCardInterval !== null) {
    clearInterval(flashCardInterval);
    flashCardInterval = null;
  }
  restartFlashCardTimer();
  flashCardInterval = setInterval(() => {
    restartFlashCardTimer();
    if (radioFind.checked) {
      flashCardFind();
    } else if (radioName.checked) {
      flashCardName();
    } else {
      if (Math.random() > 0.5) {
        flashCardFind();
      } else {
        flashCardName();
      }
    }
  }, flashCardDuration)
}
startFlashCardInterval();

// restart the countdown bar on the card so it empties over one card's duration
function restartFlashCardTimer() {
  flashCardTimerBar.style.animation = 'none';
  // reading offsetWidth forces a reflow so the animation actually restarts
  void flashCardTimerBar.offsetWidth;
  flashCardTimerBar.style.animation = `flash-card-countdown ${flashCardDuration}ms linear`;
}

// While voice is on, play a near-silent tone to keep the audio output awake.
// Otherwise the output (especially bluetooth headphones) goes idle between
// cards and the start of each phrase gets cut off while it wakes back up.
let keepAliveAudio = null;

function startAudioKeepAlive() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (keepAliveAudio === null) {
    keepAliveAudio = new AudioContextClass();
    const oscillator = keepAliveAudio.createOscillator();
    const gain = keepAliveAudio.createGain();
    // inaudible, but not zero so the output isn't treated as pure silence
    gain.gain.value = 0.0001;
    oscillator.connect(gain);
    gain.connect(keepAliveAudio.destination);
    oscillator.start();
  }
  keepAliveAudio.resume();
}

function stopAudioKeepAlive() {
  if (keepAliveAudio !== null) {
    keepAliveAudio.suspend();
  }
}

flashCardButton.addEventListener('click', () => {
  vocalizeFlashCards = !vocalizeFlashCards;
  if (vocalizeFlashCards) {
    // must start inside the click handler, since browsers (iOS especially)
    // only allow audio to start from a user gesture
    startAudioKeepAlive();
    vocalize("3, 2, 1, let's go");
    flashCardButton.innerHTML = 'On';
  } else {
    stopAudioKeepAlive();
    flashCardButton.innerHTML = 'Off';
  }
  flashCardButton.setAttribute('aria-pressed', vocalizeFlashCards);
});

flashCardDurationInput.addEventListener('input', (event) => {
  const newValue = Number(event.target.value);
  // also catches NaN, since NaN > 0 is false
  if (!(newValue > 0)) {
    flashCardDuration = 5000;
  } else {
    flashCardDuration = newValue * 1000;
  }
  startFlashCardInterval();
});

// when "All" is checked, gray out and ignore the individual string checkboxes
function syncStringCheckboxes() {
  stringCheckboxes.forEach(checkbox => {
    checkbox.disabled = stringAllCheckbox.checked;
  });
}
stringAllCheckbox.addEventListener('change', syncStringCheckboxes);
syncStringCheckboxes();

// pick a random string from the ones selected, or from all six if "All" is
// checked or nothing is selected
function pickFlashCardString() {
  const allStrings = [1, 2, 3, 4, 5, 6];
  if (stringAllCheckbox.checked) {
    return allStrings[randInt(allStrings.length)];
  }
  const selected = [...stringCheckboxes]
    .filter(checkbox => checkbox.checked)
    .map(checkbox => Number(checkbox.value));
  const pool = selected.length > 0 ? selected : allStrings;
  return pool[randInt(pool.length)];
}

// pick a random note from the selected note types (naturals, sharps, flats),
// or from all of them if none are selected
function pickFlashCardNote() {
  let pool = [];
  if (notesNaturalCheckbox.checked) pool.push(...naturalNotes);
  if (notesSharpCheckbox.checked) pool.push(...sharpNotes);
  if (notesFlatCheckbox.checked) pool.push(...flatNotes);
  if (pool.length === 0) pool = allNotes;
  return pool[randInt(pool.length)];
}

function flashCardFind() {
  const whichString = pickFlashCardString();
  const noteString = pickFlashCardNote();

  const output = [];
  output.push('On the ');
  output.push(ordinalMap[whichString]);
  output.push(' string find ');
  output.push(noteString.charAt(0).toUpperCase());
  if (noteString.length > 1) {
    output.push(noteString.charAt(1) === '#' ? '-sharp' : '-flat');
  }

  vocalize(output.join(''));
  
  flashCardInstructions.innerHTML = 'Find this note on this string:';
  flashCardHint.innerHTML = `${getString(whichString)} string ${noteString}`;
}

function flashCardName() {
  const whichString = pickFlashCardString();
  const whichFret = Math.floor(Math.random() * 13);

  const output = [];
  if (whichFret === 0) {
    vocalize(`Name the open ${ordinalMap[whichString]} string.`);
  } else {
    vocalize(`On the ${ordinalMap[whichString]} string name the ${ordinalMap[whichFret]} fret.`);
  }
  
  flashCardInstructions.innerHTML = 'Name the note on this fret:'
  flashCardHint.innerHTML = `${getString(whichString)} string ${whichFret}`
}

function vocalize(content) {
  if (!vocalizeFlashCards) return;
  utterance.text = content;
  voice.speak(utterance);
}

function getString(which) {
  const strings = [
    null,
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
  ];
  return strings[which];
}

// Helper stolen direct from StackOverflow (thank you https://stackoverflow.com/questions/9038625/detect-if-device-is-ios)
function deviceIsIos() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
