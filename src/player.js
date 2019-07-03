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

export default Player;