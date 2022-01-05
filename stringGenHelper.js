// this script for use with https://freetts.com/#ads
// copy/paste the following code (all of it) into console
// to use!!

const ordinalWords = [
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

const fbtClick = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
});
const fbtConvertButton = document.getElementById('btnAudio');
const fbtDownloadButton = document.getElementById('DivDownloadLink');
const fbtText = document.getElementById('TextMessage')

function getRandomDelay() {
  return Math.floor(Math.random() * 5000) + 2000;
}

function generateFret (stringWord, fretWord, callback, nextStringIndex, nextFretIndex) {
  fbtText.value = 'On the ' + stringWord + ' string, name the ' + fretWord + ' fret.';
  fbtConvertButton.dispatchEvent(fbtClick);
  setTimeout(function() {
    fbtDownloadButton.dispatchEvent(fbtClick);
    console.log('dispatched click for ' + fbtText.value);
    setTimeout(function() {
      callback(nextStringIndex, nextFretIndex);
    }, getRandomDelay());
  }, getRandomDelay());
}
function doFrets(stringIndex = 0, fretIndex = 0) {
  if (stringIndex >= 6) {
    stringIndex = 0;
    fretIndex++;
  }
  if (fretIndex >= 12) return;
  
  generateFret(
    ordinalWords[stringIndex],
    ordinalWords[fretIndex],
    doFrets,
    stringIndex + 1,
    fretIndex
  );
}

function generateNote (stringWord, noteWord, callback, nextStringIndex, rootNote) {
  fbtText.value = 'On the ' + stringWord + ' string, find ' + noteWord + '.';
  fbtConvertButton.dispatchEvent(fbtClick);
  setTimeout(function() {
    fbtDownloadButton.dispatchEvent(fbtClick);
    console.log('dispatched click for ' + fbtText.value);
    setTimeout(function() {
      callback && callback(nextStringIndex, rootNote);
    }, getRandomDelay());
  }, getRandomDelay());
}
function doNotes(stringIndex = 0, noteString = 'A') {
  if (stringIndex >= 6) return;
  
  generateNote(ordinalWords[stringIndex], noteString);
  setTimeout(function() {
    generateNote(ordinalWords[stringIndex], noteString + '-sharp');
    setTimeout(function() {
      generateNote(
        ordinalWords[stringIndex],
        noteString + '-flat',
        doNotes,
        stringIndex + 1,
        noteString
      );
    }, getRandomDelay());
  }, getRandomDelay());
}

function generateOpen (stringWord, callback, nextStringIndex) {
  fbtText.value = 'Name the open ' + stringWord + ' string.';
  fbtConvertButton.dispatchEvent(fbtClick);
  setTimeout(function() {
    fbtDownloadButton.dispatchEvent(fbtClick);
    console.log('dispatched click for ' + fbtText.value);
    setTimeout(function() {
      callback(nextStringIndex);
    }, getRandomDelay());
  }, getRandomDelay());
}
function doOpens(stringIndex = 0) {
  if (stringIndex >= 6) return;
  
  generateOpen(
    ordinalWords[stringIndex],
    doOpens,
    stringIndex + 1
  );
}
