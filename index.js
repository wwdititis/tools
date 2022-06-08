'use strict';

const BACKSPACE_KEY = 'Backspace';
const ENTER_KEY = 'Enter';

const INDEX_OF_THE_DAY = getRandomIndex(GUESSES.length);
// const lastUpdateTime = new Date().getTime();
// const index_day;

const WORD_OF_THE_DAY = GUESSES[INDEX_OF_THE_DAY];

// In case we want to make the game difficult or easier
const MAX_NUMBER_OF_ATTEMPTS = 6;

var pos;

const share = [];
for (var i = 0; i < MAX_NUMBER_OF_ATTEMPTS; i++) {
  share[i] = ['⬛','⬛','⬛','⬛','⬛'];
}

const history = [];
let currentWord = '';

// Get everything setup and the game responding to user actions.
const init = () => {

  // var currentTime = new Date().getTime();
  // if (currentTime - lastUpdateTime >= (24*60*60*1000)) // number of milliseconds in a day
  // {
  //   if (index_day > GUESSES.length) {
  //     index_day = 0;
  //   } else {
  //     index_day += 1;
  //   }
  //   WORD_OF_THE_DAY = GUESSES[index_day];
  //   lastUpdateTime = currentTime;
  // }

  console.log('👋 Welcome to Crewdle');

  const KEYBOARD_KEYS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

  // Grab the gameboard and the keyboard
  const gameBoard = document.querySelector('#board');
  const keyboard = document.querySelector('#keyboard');

  // Generate the gameboard and the keyboard
  generateBoard(gameBoard);
  generateBoard(keyboard, 3, 10, KEYBOARD_KEYS, true);

  // Setup event listeners
  document.addEventListener('keydown', event => onKeyDown(event.key));
  gameBoard.addEventListener('animationend', event => event.target.setAttribute('data-animation', 'idle'));
  keyboard.addEventListener('click', onKeyboardButtonClick);
}

const showMessage = (message) => {
  const toast = document.createElement('li');

  toast.textContent = message;
  toast.className = 'toast';

  document.querySelector('.toaster ul').prepend(toast);

  setTimeout(() => toast.classList.add('fade'), 1000);

  toast.addEventListener('transitionend', (event) => event.target.remove());
}

const checkGuess = (guess, word) => {
  const guessLetters = guess.split('');
  const wordLetters = word.split('');
  const remainingWordLetters = [];
  const remainingGuessLetters = [];

  // Find the current active row
  const currentRow = document.querySelector(`#board ul[data-row='${history.length}']`);

  // First, let's get all the columns in the current row set up with some base values
  currentRow.querySelectorAll('li').forEach((element, index) => {
    element.setAttribute('data-status', 'none');
    element.setAttribute('data-animation', 'flip');

    // Each letter should start its animation twice as late as the letter before it
    element.style.animationDelay = `${index * 300}ms`;
    element.style.transitionDelay = `${index * 400}ms`;
  });

  // Second iteration finds all the valid letters
  // and creates a list of leftover letters
  wordLetters.forEach((letter, index) => {
    if (guessLetters[index] === letter) {
      currentRow.querySelector(`li:nth-child(${index + 1})`)
        .setAttribute('data-status', 'valid');

      document
        .querySelector(`[data-key='${letter}']`)
        .setAttribute('data-status', 'valid');

        remainingWordLetters.push(false);
        remainingGuessLetters.push(false);

    } else {
      remainingWordLetters.push(letter);
      remainingGuessLetters.push(guessLetters[index]);
    }
  });

  // Third iteration finds all the misplaced letters
  remainingWordLetters.forEach(letter => {
    // Skip this iteration, since the letter
    // was already found in the previous phase
    if (letter === false) return;

    if (remainingGuessLetters.indexOf(letter) !== -1) {
      const column = currentRow
        .querySelector(`li:nth-child(${remainingGuessLetters.indexOf(letter) + 1})`);

      column.setAttribute('data-status', 'invalid');

      const keyboardKey = document.querySelector(`[data-key='${letter}']`);

      if (keyboardKey.getAttribute('data-status') !== 'valid') {
        keyboardKey.setAttribute('data-status', 'invalid');
      }
    }
  });

  // Fourth iteration finds all the letters on the keyboard
  // that are absent from the word.
  guessLetters.forEach(letter => {
    const keyboardKey = document.querySelector(`[data-key='${letter}']`);

    if (keyboardKey.getAttribute('data-status') === 'empty') {
      keyboardKey.setAttribute('data-status', 'gray');
    }
  });

  for (var l = 0; l < 5; l++) {
    for (var c = 0; c < 5; c++) {
      if ((guessLetters[l] === wordLetters[c]) && (l !== c)) {
        pos = l;
      }
      if ((guessLetters[l] === wordLetters[c]) && (l === c)) {
        share[history.length][l] = '🟩'; //valid
      }
    }
    if (pos !== 0) {
        share[history.length][pos] = '🟧'; //invalid
    }
    pos = 0;
  }

  history.push(currentWord);

  if (currentWord === WORD_OF_THE_DAY) {
    $('.share').html('CONGRATULACIONES!! <br><br>');
    $('.share').html($('.share').html()+INFO_WON[INDEX_OF_THE_DAY]);
    $('.hover_won').fadeIn(3000);
    return;
  } else {
    if (history.length >= MAX_NUMBER_OF_ATTEMPTS) {
      $('.share').html('Nice try! But no.');
      $('.hover_over').fadeIn(3000);
      return;
    }
  }
  currentWord = '';
}

const onKeyboardButtonClick = (event) => {
  if (event.target.nodeName === 'LI') {
    onKeyDown(event.target.getAttribute('data-key'));
  }
}

const onKeyDown = (key) => {
  // Don't allow more then 6 attempts to guess the word
  if (history.length >= MAX_NUMBER_OF_ATTEMPTS) return;

  // Find the current active row
  const currentRow = document.querySelector(`#board ul[data-row='${history.length}']`);

  // Find the next empty column in the current active row
  let targetColumn = currentRow.querySelector('[data-status="empty"]');

  if (key === BACKSPACE_KEY) {
    if (targetColumn === null) {
      // Get the last column of the current active row
      // as we are on the last column
      targetColumn = currentRow.querySelector('li:last-child');
    } else {
      // Find the previous column, otherwise get the first column
      // so we always have have a column to operate on
      targetColumn = targetColumn.previousElementSibling ?? targetColumn;
    }

    // Clear the column of its content
    targetColumn.textContent = '';
    targetColumn.setAttribute('data-status', 'empty');

    // Remove the last letter from the currentWord
    currentWord = currentWord.slice(0, -1);
    //if (currentWord === null) return;
    return;
  }

  if (key === ENTER_KEY) {
    if (currentWord.length < 5) {
      showMessage('Ye\'re missin\' a few letters, mate.');
      return;
    }

    if (currentWord.length === 5 && (GUESSES.includes(currentWord) || RELEVANT_WORDS.includes(currentWord))) {
      checkGuess(currentWord, WORD_OF_THE_DAY);
    } else {
      currentRow.setAttribute('data-animation', 'invalid');
      showMessage('That\'s not a relevant word in the OFMD universe...');
    }

    return;
  }

  // We have reached the 5 letter limit for the guess word
  if (currentWord.length >= 5) return;
  if (history.length >= MAX_NUMBER_OF_ATTEMPTS) {
    $('.hover_over').fadeIn(3000);
    return;
  }

  const upperCaseLetter = key.toUpperCase();

  // Add the letter to the next empty column
  // if the provided letter is between A-Z
  if (/^[A-Z]$/.test(upperCaseLetter)) {
    currentWord += upperCaseLetter;

    targetColumn.textContent = upperCaseLetter;
    targetColumn.setAttribute('data-status', 'filled');
    targetColumn.setAttribute('data-animation', 'pop');
  }
}

const generateBoard = (board, rows = 6, columns = 5, keys = [], keyboard = false) => {
  for (let row = 0; row < rows; row++) {
    const elmRow = document.createElement('ul');

    elmRow.setAttribute('data-row', row);

    for (let column = 0; column < columns; column++) {
      const elmColumn = document.createElement('li');
      elmColumn.setAttribute('data-status', 'empty');
      elmColumn.setAttribute('data-animation', 'idle');

      if (keyboard && keys.length > 0) {
        const key = keys[row].charAt(column);
        elmColumn.textContent = key;
        elmColumn.setAttribute('data-key', key);
      }

      // Skip adding any keyboard keys to the UI that are empty
      if (keyboard && elmColumn.textContent === '') continue;

      elmRow.appendChild(elmColumn);
    }

    board.appendChild(elmRow);
  }

  if (keyboard) {
    const enterKey = document.createElement('li');
    enterKey.setAttribute('data-key', ENTER_KEY);
    enterKey.textContent = ENTER_KEY;
    board.lastChild.prepend(enterKey);

    const backspaceKey = document.createElement('li');
    backspaceKey.setAttribute('data-key', BACKSPACE_KEY);
    backspaceKey.textContent = BACKSPACE_KEY;
    board.lastChild.append(backspaceKey);
  }
}

// Call the initialization function when the DOM is loaded to get
// everything setup and the game responding to user actions.
document.addEventListener('DOMContentLoaded', init);

// Based on the max length of the Array. Return a random items index
// within the Array's length.
function getRandomIndex (maxLength) {
  return Math.floor(Math.random() * Math.floor(maxLength));
}

function copyToClipboard(text) {
    var $temp = $("<textarea />");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

var copy='';

$(document).on('click', '.button', function(){
    for (let v=0; v < history.length; v++) {
      copy += share[v].join('')+'\n'
    }
    if (currentWord === WORD_OF_THE_DAY) {
      copyToClipboard('🏴‍☠️ Crewdle '+history.length+'/'+MAX_NUMBER_OF_ATTEMPTS+' 🍊\n\n'+copy);
      showMessage('Results copied to clipboard!');
    } else {
      if (history.length >= MAX_NUMBER_OF_ATTEMPTS) {
        copyToClipboard('🏴‍☠️ Crewdle 🍊 X/'+MAX_NUMBER_OF_ATTEMPTS+'\n\n'+copy);
        showMessage('Results copied to clipboard!');
      }
    }
});



$(document).on('click', '.popup_help', function(){
  $('.hover_help').show();
});
$(document).on('click', '.hover_help', function(){
  $('.hover_help').hide();
});
$(document).on('click', '.popup_info', function(){
  $('.hover_info').show();
});
$(document).on('click', '.hover_info', function(){
  $('.hover_info').hide();
});
