/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he wishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

const RESET_VALUE = 2;
const LIMIT_DEFAULT = 100;

let scores = [0, 0];
let activePlayer = 0;
let current = 0;
const diceElements = document.querySelectorAll('.dice');
const limitElement = document.querySelector('.input-limit');

const initGame = () => {
  document.querySelector('#current-0').textContent = 0;
  document.querySelector('#current-1').textContent = 0;
  document.querySelector('#score-0').textContent = 0;
  document.querySelector('#score-1').textContent = 0;
  diceElements.forEach(el => el.style.display = 'none');
}

initGame();

document.querySelector('.btn-roll').addEventListener('click', function() {
  const dices = []
  const limit = parseInt(limitElement.value) || LIMIT_DEFAULT

  diceElements.forEach(diceElement => {
    let dice = Math.floor(Math.random() * 6) + 1;
    dices.push(dice)
    diceElement.src = `dice-${dice}.png`;
    diceElement.style.display = 'block';
  })

  if (dices.includes(RESET_VALUE) || dices.every(el => el === dices[0])) {
    changePlayer();
    return;
  }

  current = dices.reduce((sum, dice) => sum + dice, current);
  document.getElementById('current-'+activePlayer).textContent = current;

  if (scores[activePlayer] + current >= limit) {
    alert(`Player ${activePlayer} won!!!`);
  }
});

const changePlayer = () => {
  current = 0;
  document.getElementById('current-'+activePlayer).textContent = 0;
  document.querySelector(`.player-${activePlayer}-panel`).classList.toggle('active');
  activePlayer = +!activePlayer;
  diceElements.forEach(el => el.style.display = 'none');
  document.querySelector(`.player-${activePlayer}-panel`).classList.toggle('active');
}

document.querySelector('.btn-hold').addEventListener('click', function() {
  scores[activePlayer] += current;
  document.querySelector(`#score-${activePlayer}`).textContent = scores[activePlayer];
  changePlayer();
});


document.querySelector('.btn-new').addEventListener('click', function() {
  initGame();
});
