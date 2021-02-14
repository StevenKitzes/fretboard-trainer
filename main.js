const naturalNotes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const sharpNotes = ['A#', 'B#', 'C#', 'D#', 'E#', 'F#', 'G#'];
const flatNotes = ['Ab', 'Bb', 'Cb', 'Db', 'Eb', 'Fb', 'Gb'];

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

let metronomeInterval = null;

const metronomeAudio = getEl('metronome-audio');
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

const ex5GetSevenRandom = getEl('ex5-get-seven-random');

ex1Natural.checked = true;

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
  if (value < 10) value = 10;
  if (value > 350) value = 350;
  metronomeBpm.value = value;
}  

function startMetronome () {
  const interval = parseInt(metronomeBpm.value);

  metronomeInterval = setInterval(() => {
    metronomeAudio.loop = false;
    metronomeAudio.play();
  }, bpmToInterval(interval));  
}  
function stopMetronome () {
  clearInterval(metronomeInterval);
  metronomeInterval = null;
}

function handleMetronomeStartStop () {
  if (metronomeInterval) {
    console.log(`metronomeInterval: ${metronomeInterval}`);
    return stopMetronome();
  }

  startMetronome();
}

function handleMetronomeUpdate () {
  enforceMetronomeRules();
  if (metronomeInterval) {
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

function getRandomNote (ex4Override = false) {
  const options = [];
  if (ex1Natural.checked || ex4Override) options.push(...naturalNotes);
  if (ex1Sharp.checked && !ex4Override) options.push(...sharpNotes);
  if (ex1Flat.checked && !ex4Override) options.push(...flatNotes);

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

metronomeBpm.addEventListener('change', () => {
  handleMetronomeUpdate();
});

ex1Random.addEventListener('click', () => {
  let note = getRandomNote();
  while (ex1Input.value == note) note = getRandomNote();
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
  let note1 = getRandomNote(true);
  let note2 = getRandomNote(true);
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
