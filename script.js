"use strict";

/*  basic game logic
    game object is created
    game creates player and array of zombies
    game draws UI, with 3 lanes
    game gives a primer on hiragana involved
    prompt() is like alert, 
    but it opens up a window with a message AND a place to enter some text
    player indicates ready
    game state shifts to start
    zombies appear on screen
    Above for MVP, below for extras
    add in 2 extra lanes for a total of 5
    high score stored in local storage?
    add in Ka, Ki, Ku, Ke, Ko, etc
    Special zombies with top ups of ammo, life?
    Boss monsters that have multiple hiraganas, gain life if wrong hiragana pressed
*/

const hiraganaArr = ["a", "i", "u", "e", "o"];
const zombieArr = [];
let timeout = 0; //var to prevent infinite loops in zombieMotor

const player = {
  // player object will have 3 parameters,
  // points, lives and ammo, and a function, shoot
  lives: 5,
  ammo: 20,
  points: 0,
  shoot: function (hiraganaSelected) {
    shootZombie(hiraganaSelected);
  },
};

class Zombie {
  //choosing to make zombies a class to be able to create zombies when required
  constructor(
    characterValue = "", // a, i, u, e, o for a start
    counter = Math.floor(Math.random() * 10) + 2
    //counts seconds to reach player, once counter reaches zero, zombie will bite() player
  ) {
    (this.characterValue = characterValue), (this.counter = counter);
  }
  //function bite, which will call playerBitten()
  bite() {
    console.log("bitey");
    playerBitten();
  }
}

//create game object

function createStage() {
  // Lay out windows, draw letter squares on user panel
  // draw invisible grids for zombies to be attached to
  // Call, draw zombies on screen,
  // assign each zombie a random letter, draw associated hiragana on zombie
  // pass lives, ammo and points arguments from previous totals to startGame
}

function createZombies(stage = 1) {
  const numToCreate = 5 * stage;
  for (let i = 0; i < numToCreate; i++) {
    console.log("creating zombie " + (i + 1));
    const zombie = new Zombie(hiraganaArr[i]);
    zombieArr.push(zombie);
  }
}

function playerBitten() {
  player.lives--;
  if (player.lives === 0) {
    console.log("Player has died! Game over");
  }
}

function shootZombie(shotLetter) {
  if (player.ammo === 0) {
    console.log("Out of ammo!");
  } else {
    player.ammo--;
    console.log("Bang! Ammo left: " + player.ammo);
    for (let i = 0; i < zombieArr.length; i++) {
      if (shotLetter == zombieArr[i].characterValue) {
        console.log(
          "zombie with charVal removed " + zombieArr[i].characterValue
        );
        zombieArr.splice(i, 1);
      }
    }
  }
}

function zombieMotor() {
  setTimeout(function () {
    for (let i = 0; i < zombieArr.length; i++) {
      // for every zombie, will move all zombies 1 step every second
      zombieArr[i].counter--; // counter -1 every second
      console.log(
        "Zombie " + zombieArr[i] + " counter " + zombieArr[i].counter
      );

      if (zombieArr[i].counter <= 0) {
        zombieArr[i].bite(); // if counter reaches 0, zombie will bite player
      }
    }

    timeout++; //  increment the timeout counter
    if (timeout < 20 && zombieArr.length > 0 && player.lives > 0) {
      zombieMotor(); //call itself again if all 3 criteria above are met.
    }
  }, 1000);
}

function startGame(lives = 5, ammo = 20, points = 0) {
  // start the game, call zombieMotor
  player.lives = lives;
  player.ammo = ammo;
  player.points = points;
  createZombies();
  zombieMotor();
}

const whatBtn = (e) => {
  player.shoot(e.target.innerText);
};

document.addEventListener("click", whatBtn);
