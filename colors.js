'use strict';

const BACKSPACE_KEY = 'Backspace';
const ENTER_KEY = 'Enter';

const MAX_NUMBER_OF_ATTEMPTS = 4; // +1 que LINHAS
const COLUNAS = 3; const LINHAS = 3; //TAMANHO DA GRID

const history = [];
let CURRENTLINE = '';

// function generateGrid() {
//   var cols = document.getElementById("cols").value;
//   var lins = document.getElementById("lins").value;
//   let COLUNAS = cols; let LINHAS = lins; //TAMANHO DA GRID
  
// }

const HEART_KEY = '\u2764',
      CIRCLE_KEY = '\u25CB',
      SQUARE_KEY = '\u25A1';

const SYMBOLS = [
      HEART_KEY, 
      CIRCLE_KEY, 
      SQUARE_KEY
    ];

// Get everything setup and the game responding to user actions.
const draw = () => {

  console.log('🧠 Vamos treinar a mente! 💪');

  const KEYBOARD_KEYS = [HEART_KEY+CIRCLE_KEY+'P', SQUARE_KEY+'OB', ''];

  // Grab the gameboard and the keyboard
  const gameBoard = document.querySelector('#board');
  const keyboard = document.querySelector('#keyboard');

  // Generate the gameboard and the keyboard
  generateBoard(gameBoard);
  generateBoard(keyboard, 3, 3, KEYBOARD_KEYS, true);  

  // Setup event listeners
  // document.addEventListener('keydown', event => onKeyDown(event.key));
  gameBoard.addEventListener('animationend', event => event.target.setAttribute('data-animation', 'idle'));
  keyboard.addEventListener('click', onKeyboardButtonClick);

}

const nextLine = (current_line) => {

  // Find the current active row
  const currentRow = document.querySelector(`#board ul[data-row='${history.length}']`);

  // First, let's get all the columns in the current row set up with some base values
  currentRow.querySelectorAll('li').forEach((element, index) => {  
    element.setAttribute('data-animation', 'flip');
    // Each letter should start its animation twice as late as the letter before it
    element.style.animationDelay = `${index * 300}ms`;
    element.style.transitionDelay = `${index * 400}ms`;
  });

  history.push(CURRENTLINE);
  CURRENTLINE = '';
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

    // Remove the last letter from the CURRENTLINE
    CURRENTLINE = CURRENTLINE.slice(0, -1);
    if (CURRENTLINE === null) return;
    return;
  }

  if (key === ENTER_KEY) {
    if (CURRENTLINE.length < COLUNAS) { return; }
    if (CURRENTLINE.length === COLUNAS) {
      nextLine(CURRENTLINE); } 
    return;
  }

  // We have reached the letter limit for the guess word
  if (CURRENTLINE.length >= COLUNAS) return;

  // On key press add the letter to the next empty column
  CURRENTLINE += key;

   switch(key) {
    case (HEART_KEY):
      targetColumn.setAttribute('data-status', 'green');
      targetColumn.setAttribute('data-animation', 'pop');
      break;
    case (CIRCLE_KEY):
        targetColumn.setAttribute('data-status', 'vermelho');
        targetColumn.setAttribute('data-animation', 'pop');
    break;    
    case ("P"):
      targetColumn.setAttribute('data-status', 'pink');
      targetColumn.setAttribute('data-animation', 'pop');
      break;
    case (SQUARE_KEY):
      targetColumn.setAttribute('data-status', 'yellow');
      targetColumn.setAttribute('data-animation', 'pop');
      break;
    case ("O"):
      targetColumn.setAttribute('data-status', 'orange');
      targetColumn.setAttribute('data-animation', 'pop');
     break;      
    case ("B"):
      targetColumn.setAttribute('data-status', 'blue');
      targetColumn.setAttribute('data-animation', 'pop');
    break;     
    default:
      targetColumn.setAttribute('data-status', 'filled');
      targetColumn.setAttribute('data-animation', 'pop');
    }
}

const generateBoard = (board, rows = LINHAS, columns = COLUNAS, keys = [], keyboard = false) => {
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
        switch(key) {
          case ("G"):
            elmColumn.setAttribute('data-status', 'green');    
            break;
          case ("V"):
            elmColumn.setAttribute('data-status', 'vermelho');
            break;    
          case ("P"):
            elmColumn.setAttribute('data-status', 'pink');
            break;
          case (SQUARE_KEY):
            elmColumn.setAttribute('data-status', 'yellow');
            break;
          case ("O"):
            elmColumn.setAttribute('data-status', 'orange');
            break;      
          case ("B"):
            elmColumn.setAttribute('data-status', 'blue');
            break;         
          }
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

const goRandom = () => {
  let x;
  // function myFunction(item) {
  //   sum += item;
  // }
  
  for (let i = 0; i < COLUNAS; i++) {
    for (let l = 0; l < LINHAS; l++) {
      x = Math.floor(Math.random() * 3); // 0 a 2
      onKeyDown(SYMBOLS[x]); 
    } 
    onKeyDown(ENTER_KEY);   
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
