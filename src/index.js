/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls 2 dices as many times as he wishes. Each result get added to his ROUND score
- BUT, if the player rolls a 2, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

const RESET_VALUE = 2;
const LIMIT_DEFAULT = 100;

const storage = {
  data: {},
  save: function (player) {
    this.data[player.getName()] = player;
    this.update();
  },
  findByName: function (name) {
    return this.data[name];
  },
  getAll: function () {
    return Object.keys(this.data)
      .reduce((players, key) => {
        players.push(this.data[key]);
        return players;
      }, [])
  },
  init: function () {
    if (!localStorage.getItem('storageData')) {
      localStorage.setItem('storageData', JSON.stringify(this.data));
    } else {
      const storageData = JSON.parse(localStorage.getItem('storageData'));
      this.data = Object.keys(storageData).reduce((players, key) => {
        players[key] = new Player(storageData[key].name, storageData[key].wins)
        return players
      }, {});
    }
  },
  update: function () {
    localStorage.setItem('storageData', JSON.stringify(this.data));
  }
};

const gamer = {
  getScore: function () {
    return this.score;
  },
  setScore: function (score) {
    this.score = score;
  },
  win: function () {
    this.wins++
  },
  getWins: function () {
    return this.wins;
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

function Player(name, wins) {
  this.wins = wins || 0;
  this.setName(name);
  this.resetScore();
}

Player.prototype = gamer;

let activePlayerIndex;
let current;

const diceElements = document.querySelectorAll('.dice');
const limitElement = document.querySelector('.input-limit');
const playerElements = document.querySelectorAll('.player-name');
const resultElement = document.querySelector('.btn-results');
const rollButton = document.querySelector('.btn-roll');
const holdButton = document.querySelector('.btn-hold');

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
  rollButton.disabled = false;
  holdButton.disabled = false;
}

const changePlayer = () => {
  current = 0;
  document.getElementById('current-'+activePlayerIndex).textContent = '0';
  document.querySelector(`.player-${activePlayerIndex}-panel`).classList.toggle('active');
  activePlayerIndex = +!activePlayerIndex;
  diceElements.forEach(el => el.style.display = 'none');
  document.querySelector(`.player-${activePlayerIndex}-panel`).classList.toggle('active');
}

const onChangePlayerName = index => e => {
  const currentName = currentPlayers[index].getName();
  const name = prompt('Введите имя', currentName);
  if (name && name !== currentName) {
    const storagePlayer = storage.findByName(name);
    if (storagePlayer) {
      const confirmLoad = confirm(`Загрузить ${name} с ${storagePlayer.getWins()} победами?`);
      if (confirmLoad) {
        currentPlayers[index] = storagePlayer;
        e.target.innerText = name;
      } else {
        alert('Введите другое имя!');
      }
    } else {
      currentPlayers[index] = new Player(name);
      e.target.innerText = name;
    }
    initGame();
  }
}

const onRoll = () => {
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
    getActivePlayer().win();
    storage.save(getActivePlayer());
    setTimeout(() => alert(`${getActivePlayer().getName()} выиграл!!!`), 0);
    rollButton.disabled = true;
    holdButton.disabled = true;
  }
}

const onHold = () => {
  const score = getActivePlayer().getScore() + current;
  getActivePlayer().setScore(score);
  document.querySelector(`#score-${activePlayerIndex}`).textContent = getActivePlayer().getScore();
  changePlayer();
}

const showResults = () => {
  const results = storage.getAll().sort((a, b) => b.getWins() - a.getWins()).reduce((result, player) => {
    return result + `\n${player.getName()}: ${player.getWins()}`
  }, '');

  alert('Результаты: ' + (results.length ? results : '\nПока турнирная таблица пуста!'));
}

const initListeners = () => {
  playerElements.forEach((player, index) => {
    player.addEventListener('click', onChangePlayerName(index))
  });

  document.querySelector('.btn-roll').addEventListener('click', onRoll);
  document.querySelector('.btn-hold').addEventListener('click', onHold);
  document.querySelector('.btn-new').addEventListener('click', initGame);
  resultElement.addEventListener('click', showResults);
}

storage.init();
initListeners();
initGame();
