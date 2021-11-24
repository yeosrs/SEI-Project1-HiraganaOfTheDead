"use strict";
let stage = 1;
document.querySelector("#blurb").innerText =
  "You are travelling alone in Tokyo on an Japanese Language immersion trip. It's a really fun trip until one morning, you step out of your AirBnb and find the streets deserted except for zombies! With your quick wits you notice that each zombie is holding a card with Hiragana (Japanese alphabet) in its left hand and identifying the Hiragana kils the zombie. With your trusty Hiragana flashcards in hand, you set out to find a way out of the city...";
const hirFlash = document.createElement("img");
hirFlash.setAttribute("src", "images/aiueo.jpeg");
document.querySelector("#blurb").append(hirFlash);
const startBtnPressed = (e) => {
  window.location.replace("game.html");
};

document.querySelector("#start").addEventListener("click", startBtnPressed);

