// remove this line
const myImage = document.getElementById("my-image");
let answer = "";
let column = 0;
let row = 0;
let dict = {};
let index = "";
let true_answer = "";
let true_answer_word = "";
let word_hint = "";
let counter = 0;
let trials = 0;

const tds = document.getElementsByTagName("td");
const hello = document.getElementById("show");
const startButton = document.getElementById("start-over-button");
const hint_button = document.getElementById("hint");
const hint = document.getElementById("give_hint");
const originalText = startButton.textContent;

const startGame = async () => {
  // reset all the variables
  answer = "";
  column = 0;
  row = 0;
  dict = {};
  index = "";
  true_answer = "";
  true_answer_word = "";
  word_hint = "";
  counter = 0;
  trials = 0;
  myImage.src = "";
  hint.textContent = "";
  document.getElementById("you_won").style.display = "none";
  document.getElementById("you_lost").style.display = "none";
  startButton.textContent = "Start over";

  // clear all the cells
  for (const td of tds) {
    td.innerText = "";
    td.style.backgroundColor = "white";
  }
  if (Object.keys(dict).length === 0) {
    console.log("first time");
    await getDictionary();
  }

  // show the board
  hello.classList.remove("hidden");

  // dict is filled
  // grab a new word
  choose_word();
};

startButton.addEventListener("click", () => {
  //window.addEventListener("beforeunload", () => {
  //startButton.disabled = true;
  //});
  startButton.textContent = "Loading...";
  startGame();
});

startButton.addEventListener("keydown", (event) => {
  event.preventDefault();
});

const getDictionary = async () => {
  const res = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
      "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
  });

  dict = await res.json();
  console.log(dict);
};

const ex_button = document.getElementById("explain");
const explain = document.getElementById("explanation");
console.log(ex_button);

ex_button.addEventListener("click", () => {
  explain.classList.toggle("hidden");
});
const [body] = document.getElementsByTagName("body");

function dark_mode() {
  body.classList.toggle("dark");
}

const mode_button = document.getElementById("change_mode");
mode_button.addEventListener("click", dark_mode);

hint_button.addEventListener("click", () => {
  console.log("clicke");
  give_hint.classList.toggle("hidden");
});

function choose_word() {
  index = Number.parseInt(Math.random() * dict.dictionary.length);
  console.log(index);
  true_answer = dict.dictionary[index];
  console.log(true_answer);
  true_answer_word = true_answer.word.toUpperCase();
  word_hint = "";
  word_hint = true_answer.hint;

  console.log(hint_button);
  hint.append("hint = " + word_hint);
}

//how to make a request
startGame();

function isCharacterALetter(char) {
  return /^[a-zA-Z]{1}$/.test(char);
}

document.addEventListener("keyup", (event) => {
  console.log(event.key);

  if (event.key == "Backspace" && counter % 4 == 0 && counter == 0) return;
  if (event.key == "Backspace") {
    tds[column - 1].innerText = "";
    column = column - 1;
    answer = answer.slice(0, -1);
    counter = counter - 1;
    console.log("counter =" + counter);
    return;
  } else if (isCharacterALetter(event.key) !== true && event.key !== "Enter") {
    alert("enter a letter");
    return;
  } else if (event.key == "Enter" && counter < 4) {
    alert("you should complete the word first");
    return;
  } else if (isCharacterALetter(event.key) == true && counter < 4) {
    tds[column].innerText = event.key.toUpperCase();
    column += 1;
    answer += event.key.toUpperCase();
    console.log(column);
    counter = counter + 1;
  }
  if (column % 4 === 0 && column !== 0) {
    console.log("reached end of the row...");
    if (event.key == "Enter") {
      trials = trials + 1;
      if (true_answer_word === answer) {
        myImage.src = "giphy.gif";
        hello.classList.add("hidden");
        document.getElementById("you_won").style.display = "block";
        document.getElementById("you_won").innerHTML =
          "You guessed the word " + true_answer_word + " correctly!";
      }
      for (var j = 0; j < 4; j++) {
        if (true_answer_word[j] == answer[j]) {
          tds[j + row].style.backgroundColor = "green";
        } else if (true_answer_word.includes(answer[j])) {
          tds[j + row].style.backgroundColor = "yellow";
        } else {
          tds[j + row].style.backgroundColor = "gray";
        }
      }
      if (trials == 4) {
        document.getElementById("you_lost").style.display = "block";
        document.getElementById("you_lost").innerHTML =
          "You missed the word " + true_answer_word + " and lost!";
      }
      row = row + 4;
      answer = "";
      counter = 0;
      return;
    }
  }
});
