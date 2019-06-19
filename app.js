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

const gamer = {
  getScore: function () {
    return this.score;
  },
  setScore: function (score) {
    this.score = score;
  },
  resetScore: function () {
    this.setScore(0);
  },
  getName: function () {
    return this.name;
  },
  setName: function (name) {
    this.name = name;
  }
}

function Player(name) {
  this.setName(name);
  this.resetScore();
}

Player.prototype = gamer;

let activePlayerIndex;
let current;

const diceElements = document.querySelectorAll('.dice');
const limitElement = document.querySelector('.input-limit');
const playerElements = document.querySelectorAll('.player-name');

const currentPlayers = [new Player('Игрок 1'), new Player('Игрок 2')];

const getActivePlayer = () => currentPlayers[activePlayerIndex];

const initGame = () => {
  activePlayerIndex = 0;
  current = 0;

  currentPlayers.forEach((player, index) => {
    player.resetScore();
    document.querySelector(`#score-${index}`).textContent = player.getScore();
    document.querySelector(`#current-${index}`).textContent = '0';
    document.querySelector(`.player-${index}-panel`).classList.remove('active');
  })
  document.querySelector(`.player-${activePlayerIndex}-panel`).classList.add('active');

  diceElements.forEach(el => el.style.display = 'none');
}

playerElements.forEach((player, index) => {
  player.addEventListener('click', function (e) {
    const currentName = currentPlayers[index].getName();
    const name = prompt('Введите имя', currentName);
    if (name) {
      currentPlayers[index].setName(name);
      e.target.innerText = name;
    }
  })
});

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
  document.getElementById('current-'+activePlayerIndex).textContent = current;

  if (getActivePlayer().getScore() + current >= limit) {
    setTimeout(() => alert(`${getActivePlayer().getName()} выиграл!!!`), 0);
  }
});

const changePlayer = () => {
  current = 0;
  document.getElementById('current-'+activePlayerIndex).textContent = '0';
  document.querySelector(`.player-${activePlayerIndex}-panel`).classList.toggle('active');
  activePlayerIndex = +!activePlayerIndex;
  diceElements.forEach(el => el.style.display = 'none');
  document.querySelector(`.player-${activePlayerIndex}-panel`).classList.toggle('active');
}

document.querySelector('.btn-hold').addEventListener('click', function() {
  const score = getActivePlayer().getScore() + current;
  getActivePlayer().setScore(score);
  document.querySelector(`#score-${activePlayerIndex}`).textContent = getActivePlayer().getScore();
  changePlayer();
});

document.querySelector('.btn-new').addEventListener('click', function() {
  initGame();
});

initGame();
