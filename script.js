"use strict";

/*  basic game logic
    game gives a primer on hiragana involved
    prompt() is like alert, 
    but it opens up a window with a message AND a place to enter some text
    player indicates ready
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
let stage = 1;
let playerAlive = true;

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
    counter = Math.ceil(Math.random() * 9) + 6
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

function createStage(stage = 1) {
  // Split window into the playPanel where zombies will appear
  // and controlPanel, where user's buttons will appear
  const mainPanel = document.createElement("div");
  mainPanel.setAttribute("id", "mainPanel");
  document.querySelector("body").append(mainPanel);
  const playPanel = document.createElement("div");
  playPanel.id = "playPanel";
  mainPanel.appendChild(playPanel);
  const controlPanel = document.createElement("div");
  controlPanel.id = "controlPanel";
  mainPanel.appendChild(controlPanel);
  const spacerRow = document.createElement("div");
  // spacerRow to prevent effect of zombies floating down from the sky
  spacerRow.setAttribute("class", "spacerRow");
  playPanel.appendChild(spacerRow);
  for (let i = 15; i > -1; i--) {
    // split playPanel into 10 divs to mimic rows
    const divRow = document.createElement("div");
    divRow.setAttribute("class", "playRow");
    divRow.setAttribute("id", `row${i}`);
    playPanel.appendChild(divRow);
    for (let j = 0; j < 7; j++) {
      // create 7 divs for each row to mimic columns,
      // only middle 5 will be used. the 2 at the ends will be used as spacers
      const position = document.createElement("div");
      position.setAttribute("class", "position");
      position.setAttribute("id", `row${i}pos${j}`);
      divRow.appendChild(position);
    }
  }

  const numToCreate = 5 * stage;
  for (let i = 0; i < numToCreate; i++) {
    const btn = document.createElement("button");
    btn.setAttribute("class", "hirBtn");
    btn.innerText = hiraganaArr[i];
    document.querySelector("#controlPanel").appendChild(btn);
  }
  const stats = document.createElement("div");
  stats.setAttribute("id", "stats");
  stats.innerText = `Player Lives: ${player.lives} Ammo left: ${player.ammo} Points: ${player.points}`;
  controlPanel.appendChild(stats);

  // assign each zombie a random letter, draw associated hiragana on zombie
  // pass lives, ammo and points arguments from previous totals to startGame
}

function createZombies(stage = 1) {
  //creating zombies, increase 5 per stage
  const numToCreate = 5 * stage;
  for (let i = 0; i < numToCreate; i++) {
    console.log("creating zombie " + (i + 1));
    const zombie = new Zombie(hiraganaArr[i]);
    zombieArr.push(zombie);
    const zombieCSS = document.createElement("div");
    // create css equivalents of zombies,
    // and assign them in row according to their counter so player can see how far they are,
    // and assign them random positions in their row
    zombieCSS.setAttribute("class", "zombie");
    zombieCSS.setAttribute("id", `zombie${hiraganaArr[i]}`);
    zombieCSS.innerText = hiraganaArr[i];
    const hiraSticker = document.createElement("div");
    hiraSticker.innerHTML = `<img class="hiraSticker" src="images/${hiraganaArr[i]}.jpeg"/>`;
    zombieCSS.append(hiraSticker);
    const pos = Math.floor(Math.random() * (4 - 2 + 1) + 2);
    document
      .querySelector(`#row${zombie.counter}pos${pos}`)
      .appendChild(zombieCSS);
  }
}

function playerBitten() {
  player.lives--;
  document.querySelector(
    "#stats"
  ).innerText = `Player Lives: ${player.lives} Ammo left: ${player.ammo} Points: ${player.points}`;
  if (player.lives === 0) {
    playerAlive = false;
    setTimeout(() => alert("Player has died! Game over"), 0);
  }
}

function shootZombie(shotLetter) {
  if (player.ammo === 0) {
    //check if player still has ammo
    console.log("Out of ammo!");
  } else {
    player.ammo--;
    console.log("Bang! Ammo left: " + player.ammo);
    document.querySelector(
      "#stats"
    ).innerText = `Player Lives: ${player.lives} Ammo left: ${player.ammo} Points: ${player.points}`;
    for (let i = 0; i < zombieArr.length; i++) {
      //run through array and find corressponding zombie
      if (shotLetter == zombieArr[i].characterValue) {
        console.log(
          "zombie with charVal removed " + zombieArr[i].characterValue
        );
        zombieArr.splice(i, 1);
        document.querySelector(`#zombie${shotLetter}`).remove();
        player.points += 100;
        document.querySelector(
          "#stats"
        ).innerText = `Player Lives: ${player.lives} Ammo left: ${player.ammo} Points: ${player.points}`;
      }
      if (zombieArr.length === 0) {
        stage++;
        //setTimeout(() => alert("Stage Cleared!"), 0);
        window.location.replace("index.html");
      }
    }
  }
}

function zombieMotor() {
  setTimeout(function () {
    for (let i = 0; i < zombieArr.length; i++) {
      const pos = Math.floor(Math.random() * (4 - 2 + 1) + 2);
      // for every zombie, will move all zombies 1 step every second
      if (zombieArr[i].counter > 0) {
        zombieArr[i].counter--; // counter -1 every second until it reaches 0
        //move zombieCSS object until it reaches row 0
        document
          .querySelector(`#row${zombieArr[i].counter}pos${pos}`)
          .appendChild(
            document.querySelector(`#zombie${zombieArr[i].characterValue}`)
          );
      }
      console.log(
        "Zombie " +
          zombieArr[i].characterValue +
          " counter " +
          zombieArr[i].counter
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

function startGame(stage) {
  // start the game, call zombieMotor
  createStage(stage); //create the game windows
  createZombies(stage);
  zombieMotor();
}

const whatBtn = (e) => {
  player.shoot(e.target.innerText);
};

startGame(stage);

document.addEventListener("click", whatBtn);
