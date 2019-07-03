import Player from './player.js';

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

export default storage;
