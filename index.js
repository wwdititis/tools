'use strict';

const BACKSPACE_KEY = 'Backspace';
const ENTER_KEY = 'Enter';

const COLUNAS = 10; const LINHAS = 1; //TAMANHO DA GRID

const workingDate = [];
let sCURRENTLINE = '';

// Get everything setup and the game responding to user actions.
const draw = () => {

  console.log('🧠 Vamos treinar a mente! 💪');

  const GRID_KEYS = ['00/00/0000'];
  const NUMPAD_KEYS = ['123', '456', '789','000','000'];

  // Grab the dateGrid and the numPad
  const dateGrid = document.querySelector('#dateGrid');
  const numPad = document.querySelector('#keyboard');

  // generate date grid
  generateBoard(dateGrid, LINHAS, COLUNAS, GRID_KEYS, false);
  // generate numbers pad keyboard
  generateBoard(numPad, 3, 5, NUMPAD_KEYS, true);  

  // Setup event listeners
  // document.addEventListener('keydown', event => onKeyDown(event.key));
  dateGrid.addEventListener('animationend', event => event.target.setAttribute('data-animation', 'idle'));
  numPad.addEventListener('click', onKeyboardButtonClick);

}

// what to do when ENTER is pressed and date is full
const onEnter = (current_line) => {

  // Find the current active row
  const currentRow = document.querySelector(`#dateGrid ul[data-row='0']`);

  // First, let's get all the columns in the current row set up with some base values
  currentRow.querySelectorAll('li').forEach((element, index) => {  
    element.setAttribute('data-animation', 'flip');
    // animation of board after ENTER press
    element.style.transitionDelay = `${index * 300}ms`;
  });

  workingDate = Array.from(sCURRENTLINE);

}

const onKeyboardButtonClick = (event) => {
  if (event.target.nodeName === 'LI') {
    onKeyDown(event.target.getAttribute('data-key'));
  }
}

const onKeyDown = (key) => {

  // Find board row
  const currentRow = document.querySelector(`#dateGrid ul[data-row='0']`);

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
    // Remove the last letter from the CURRENTLINE
    sCURRENTLINE = sCURRENTLINE.slice(0, -1);
    if (sCURRENTLINE === null) return;
    return;
  }

  if (key === ENTER_KEY) {
    if (sCURRENTLINE.length < COLUNAS) { return; }
    if (sCURRENTLINE.length === COLUNAS) {
      // only calls ENTER if full date
      onEnter(sCURRENTLINE); } 
    return;
  }

  // We have reached the letter limit for the guess word
  if (sCURRENTLINE.length >= COLUNAS) return;

  // onkey press populate curretline
  sCURRENTLINE += key;
  // On key press add the key to the next empty column
  if (!isNaN(key)) {
    targetColumn.setAttribute('data-status', 'green');
    targetColumn.setAttribute('data-animation', 'pop');
    targetColumn.textContent = key;
  }
}

const generateBoard = (board, rows = LINHAS, columns = COLUNAS, keys = [], numPad = false) => {
  for (let row = 0; row < rows; row++) {
    const elmRow = document.createElement('ul');

    elmRow.setAttribute('data-row', row);

    for (let column = 0; column < columns; column++) {
      const elmColumn = document.createElement('li');
      elmColumn.setAttribute('data-status', 'empty');
      elmColumn.setAttribute('data-animation', 'idle');
      elmColumn.textContent = keys[row].charAt(column);

      if (numPad && keys.length > 0) {
        const key = keys[row].charAt(column);
        elmColumn.textContent = key;
        elmColumn.setAttribute('data-key', key);
      }

      // Skip adding any empty keys to the UI
      if (numPad && elmColumn.textContent === '') continue;

      elmRow.appendChild(elmColumn);
    }

    board.appendChild(elmRow);
  }

  if (numPad) {
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
document.addEventListener('DOMContentLoaded', draw);


$(document).on('click', '.popup_help', function(){
  $('.hover_help').fadeIn(250);
});
$(document).on('click', '.hover_help', function(){
  $('.hover_help').hide();
});
$(document).on('click', '.popup_info', function(){
  $('.hover_info').fadeIn(250);
});
$(document).on('click', '.hover_info', function(){
  $('.hover_info').hide();
});



// IMPORTANT DONT DELETE
window.onkeydown = function (event) {
  if (event.which == 8) {
     event.preventDefault();   // turn off browser transition to the previous page
  }};
// IMPORTANT DONT DELETE
