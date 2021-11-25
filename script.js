"use strict";

const hiraganaArr = [
  "a",
  "i",
  "u",
  "e",
  "o",
  "ka",
  "ki",
  "ku",
  "ke",
  "ko",
  "sa",
  "shi",
  "su",
  "se",
  "so",
  "ta",
  "chi",
  "tsu",
  "te",
  "to",
  "na",
  "ni",
  "nu",
  "ne",
  "no",
  "ha",
  "hi",
  "fu",
  "he",
  "ho",
  "ma",
  "mi",
  "mu",
  "me",
  "mo",
  "ra",
  "ri",
  "ru",
  "re",
  "ro",
  "ya",
  "yu",
  "yo",
  "wa",
  "wo",
  "n",
]; // to store available hiragana
const zombieArr = []; //to store created zombies
const blurbArr = [
  "",
  "You are travelling alone in Tokyo on an Japanese Language immersion trip. It's a really fun trip until one morning, you step out of your AirBnb and find the streets deserted except for zombies! With your quick wits you notice that each zombie is holding a card with Hiragana (Japanese alphabet) in its left hand and identifying the Hiragana kils the zombie. With your trusty Hiragana flashcards in hand, you set out to find a way out of the city...",
  "Man, that was close! You barely manage to identify the 5 zombies and dash off to the nearest JR line station, but the station is likewise deserted, and after waiting for an hour, you realise that no trains are running. You hear zombies closing in. You pack your belongings and look at your flashcards one more time before stepping out of the station...",
  "You slam the door behind you, out of breath. Your stomach growls. It’s been 16 hours since your last meal and you’re ravenous. Plus all that running around has made you thirsty. You look for a kombini (convenience store) on Google Maps and there’s 2 around the corner! You open the door to head towards the konbinis..",
  "Eek! You barely made it back to the room. That’s a lot of zombies around that street! That’s the last time you’ll be rushing out of any door, hungry or not. You look around the room to find another exit and spot another door in the darkness at the other wall. You put your ear to the door, and hearing no sound on the other side, inch it open and take a peek…",
  "You finally reach the konbini via its back door, but it looks like others have been in it before you, and the shelves are mostly empty, only a few morsels of food, and the drinks fridge is completely empty, except for a few packets of milk that have spilled most of their contents on the floor. You need to get to the other konbini to find more food and drink...",
  "You finally lose the zombies chasing you, and enter the konbini. Your luck is much better here, it appears to be fully stocked. You gorge yourself on the food, then you remember that to survive, you need to keep on running. You decide to hunker down in the konbini for the night as it’s getting dark outside. You look around for a blanket to keep warm..",
  "You huff and puff as the noises of the zombies fade away. You had spent a fitful night, with snatches of sleep. You woke up at 4am to use the toilet, but flushing the toilet alerted a horde of zombies and you ran away for your life. Your phone battery is getting low, and you need a charger. You curse yourself for getting the EMG Emperor with its proprietary charger head. You spot a Yodobashi Camera up ahead and head in….. No luck. Lots of USB-C chargers but not yours. There’s a Yamada Denki 2 blocks south...",
  "You make it to the Yamada Denki. Even better, they have your charger! You feel bad for taking it, but it’s an emergency. With your phone recharged, you find out that people are gathering at Narita Airport, and there’s an evacuation going on. However the bad news is Narita is about 70km east of where you are, and it seems there are a lot of zombies on the way. You need to find a mode of transport..",
  "You manage to find a car with gas AND the keys in it, and drive a mostly uneventful trip to Narita Airport. However you need to get out to proceed on foot because the gate to the tarmac is too narrow to drive the car in….",
  "One last batch of zombies. You can see the waiting jet in the distance, if only you can get past this last group….",
]; //to store the  blurbs for each stage
let timeout = 0; //var to prevent infinite loops in zombieMotor
let stage = 1;

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
function createModal() {
  //creation of the modal that will appear before each stage
  const modal = document.createElement("div");
  modal.setAttribute("class", "modal");
  modal.setAttribute("id", "modal");
  const stageH2 = document.createElement("h2");
  stageH2.setAttribute("id", "stageH2");
  stageH2.innerText = "Stage " + stage;
  mainPanel.append(modal);
  const modalContent = document.createElement("div");
  modalContent.setAttribute("class", "modal-content");
  modalContent.setAttribute("id", "modal-content");
  modalContent.append(stageH2);
  modal.append(modalContent);
  const blurb = document.createElement("div");
  blurb.setAttribute("class", "blurb");
  blurb.setAttribute("id", "blurb");
  blurb.innerText = blurbArr[stage];
  modalContent.append(blurb);
  const hiraganaChart = document.createElement("div");
  hiraganaChart.setAttribute("id", "hiraganaChart");
  hiraganaChart.innerHTML = `<img class="hiraSticker" src="images/${stage}.jpeg"/>`;
  modalContent.append(hiraganaChart);
  const continueButton = document.createElement("button");
  continueButton.setAttribute("class", "button");
  continueButton.innerText = "Continue";
  modalContent.append(continueButton);
}

function createStage(stage) {
  // Split window into the playPanel where zombies will appear
  // and controlPanel, where user's buttons will appear
  if (stage === 1) {
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
      // split playPanel into 15 divs to mimic rows
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
  }
  document.querySelector("#controlPanel").innerHTML = "";
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

  if (stage > 1) {
    // modify the modalContent block for subsequent stages
    document.getElementById("modal").style.display = "block";
    document.getElementById("stageH2").innerText = "Stage " + stage;
    document.getElementById("blurb").innerText = blurbArr[stage];
    document.getElementById(
      "hiraganaChart"
    ).innerHTML = `<img class="hiraSticker" src="images/${stage}.jpeg"/>`;
  }
}

function createZombies(stage) {
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
    if (zombie.counter < 10 && zombie.counter >= 5) {
      zombieCSS.setAttribute("class", "zombie1");
    } else if (zombie.counter < 5) {
      zombieCSS.setAttribute("class", "zombie2");
    } else {
      zombieCSS.setAttribute("class", "zombie");
    }
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
    alert("Player has died! Game over");
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
        document
          .querySelector(`#zombie${shotLetter}`)
          .setAttribute("class", "hidden zombie"); //.hidden fade out effect
        player.points += 100;
        document.querySelector(
          "#stats"
        ).innerText = `Player Lives: ${player.lives} Ammo left: ${player.ammo} Points: ${player.points}`;
      }
      if (zombieArr.length === 0) {
        const countHidden = document.querySelectorAll(".hidden").length;
        for (let j = 0; j < countHidden; j++) {
          //clean up all the .hidden
          document.querySelector(".hidden").remove();
        }
        stage++;
        timeout = 0;
        player.ammo += stage * 7;
        player.lives += 1;
        createStage(stage); //call createStage again to reset playPanel
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
      if (zombieArr[i].counter < 10 && zombieArr[i].counter >= 5) {
        document
          .querySelector(`#zombie${zombieArr[i].characterValue}`)
          .setAttribute("class", "zombie1");
      } else if (zombieArr[i].counter < 5) {
        document
          .querySelector(`#zombie${zombieArr[i].characterValue}`)
          .setAttribute("class", "zombie2");
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
  createZombies(stage);
  zombieMotor();
}

function initGame(stage) {
  createStage(stage); //create the game windows
  createModal();
}

const whatBtn = (e) => {
  switch (e.target.innerText) {
    case "Continue":
      console.log("Continue clicked!");
      document.getElementById("modal").style.display = "none";
      startGame(stage);
      break;

    default:
      player.shoot(e.target.innerText);
      break;
  }
};

initGame(stage);

document.addEventListener("click", whatBtn);
