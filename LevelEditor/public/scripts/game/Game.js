'use strict';

import WorldController from './Contollers/WorldController.js';

export default class Game {
  constructor() {
    this.leveData = [
      {
        name: 'asdf',
        userid: 'pg18alex'
      }
    ];
    this.setUIHandlers();
  }

  run() {
    this.setMouseHandlers();
    this.update();
  }

  setUIHandlers() {
    $('#start-game-buttom').on('click', event => this.loadGame(event));
  }

  loadGame() {
    $('#main-screen').css('display', 'none');
    $('#loading-screen').css('display', 'flex');

    const [ levelData ] = this.leveData;
    const { name, userid } = levelData;

    $.post(`/api/level/load/${userid}`, { fileName: name })
      .then( responseData => {
        const { payload: { levelData } } = responseData;

        this.world = new WorldController(levelData);
        $('#loading-screen').css('display', 'none');
        $('#game').css('display', 'block');
        this.run();
      })
      .catch(error => {
        console.log(error);
        alert('We couldnt load the requested level, wooops');
      });
  }

  setMouseHandlers() {
    const viewport = $('#editor');

    viewport.on('mouseover',   (event) => this.over(event));
    viewport.on('mousedown',   (event) => this.down(event));
    // // viewport.on('mousemove',   (event) => this.move(event));
    viewport.on('mouseout',    (event) => this.out(event));
    viewport.on('mouseup',     (event) => this.up(event));
    // viewport.on('contextmenu', (event) => this.delete(event));
  }

  over(event) {
    // Set a visual aiming thingy I guess
    return;
  }

  down(event) {
    const { offsetX: x, offsetY: y } = event;

    this.shotLockedIn = true;
    this.initialMousePosition = { x, y };
  }

  out(event) {
    if (event.currentTarget === $('#editor')[0]) {
      return;
    }
    this.shotLockedIn = false;
    this.initialMousePosition = {};
  }

  up(event) {
    if (this.shotLockedIn) {
      const { clientX: x, clientY: y } = event;
      const { x: x0, y: y0 } =  this.initialMousePosition;

      const impulse = { x: (x0 - x) * 50, y: (y0 - y) * 50 };

      this.world.shoot(impulse);
    }
  }

  update() {
    this.world.update();

    requestAnimationFrame(() => this.update());
  }
}
