// Declare selectedButton, currentFlag, and player lives in the global scope
let selectedButton = null;
let currentFlag = null;
let usedCountries = [];
let playerLives = 3; // Start with 3 lives

// Add the paths for the heart images
const redHeart = "./assets/red-heart.png"; // Path to the red heart image
const grayHeart = "./assets/gray-heart.png"; // Path to the gray heart image

document.getElementById("startButton").addEventListener("click", function () {
	showScreen("joinScreen");
});

document.getElementById("joinButton").addEventListener("click", function () {
	const playerName = document.getElementById("playerName").value;
	if (playerName) {
		player = new Player(playerName);
		showScreen("difficultyScreen");
		const welcomeMessage = document.createElement("p");
		welcomeMessage.innerText = `Welcome, ${playerName}! Please choose a difficulty:`;
		const heading = document.querySelector("#difficultyScreen h2");
		heading.insertAdjacentElement("afterend", welcomeMessage);
		const playerInfo = document.getElementById("player-info");
		playerInfo.textContent = `${player.name}: ${player.score}`;
	} else {
		alert("Please enter your name");
	}
});

document.getElementById("easyButton").addEventListener("click", function () {
	startGame("easy");
});

document.getElementById("hardButton").addEventListener("click", function () {
	startGame("hard");
});

document.getElementById("playButton").addEventListener("click", function () {
	showScreen("playScreen");
});

// Function to show different screens
function showScreen(screenId) {
	const screens = document.querySelectorAll(".screen");
	screens.forEach((screen) => (screen.style.display = "none"));
	document.getElementById(screenId).style.display = "flex";
}

function startGame(difficulty) {
	console.log("Selected Difficulty:", difficulty);
	showScreen("startScreen");

	// Fetch countries.json data and start the game
	fetchCountries();
	// Initialize the player's lives
	updateLivesDisplay();
}

// Player class
class Player {
	constructor(name) {
		this.name = name;
		this.score = 0;
	}
	incrementScore() {
		this.score++;
	}
}

// Create a new player
let player = new Player("Maria");

// Update player info on the page
function updatePlayerInfo() {
	let playerInfo = document.getElementById("player-info");
	playerInfo.textContent = `${player.name}: ${player.score}`;
	console.log("updated");
}

updatePlayerInfo();

let countries = [];

// Function to fetch countries from JSON
function fetchCountries() {
	fetch("./data/countries.json")
		.then((response) => response.json())
		.then((data) => {
			countries = data;
			initGame(countries);
		})
		.catch((error) => {
			console.error("Error loading countries:", error);
		});
}

// Function to initialize the game
function initGame(countries) {
	displayNewFlag();
}

function displayNewFlag() {
	let availableCountries = countries.filter(
		(country) => !usedCountries.includes(country.name)
	);

	if (availableCountries.length === 0) {
		alert("Game Over! You've seen all the flags.");
		return;
	}

	let shuffledAvailableCountries = shuffle(availableCountries.slice());
	let correctCountry = shuffledAvailableCountries[0];
	currentFlag = correctCountry;
	usedCountries.push(correctCountry.name);

	let incorrectCountries = shuffle(
		countries.filter((country) => country.name !== correctCountry.name)
	).slice(0, 3);

	let options = shuffle([correctCountry, ...incorrectCountries]);

	displayFlag(correctCountry.flag);
	displayOptions(options);
}

function displayFlag(flagUrl) {
	let flagDisplay = document.getElementById("flag-display");
	flagDisplay.innerHTML = "";

	let flagImage = document.createElement("img");
	flagImage.src = flagUrl;
	flagImage.className = "flag";
	flagDisplay.appendChild(flagImage);
}

function displayOptions(options) {
	let gameBoard = document.getElementById("game-board");
	gameBoard.innerHTML = "";

	options.forEach((country) => {
		let button = document.createElement("button");
		button.textContent = country.name;
		button.dataset.country = country.name;
		button.addEventListener("click", handleButtonClicked);
		gameBoard.appendChild(button);
	});
}

function handleButtonClicked() {
	if (!selectedButton) {
		selectedButton = this;
		setTimeout(checkForMatch, 500);
	}
}

function checkForMatch() {
	if (
		currentFlag &&
		selectedButton &&
		selectedButton.dataset.country === currentFlag.name
	) {
		console.log("Match!");
		player.incrementScore();
		updatePlayerInfo();
	} else {
		console.log("No match!");
		playerLives--; // Decrement the player's lives
		updateLivesDisplay(); // Update the hearts display

		if (playerLives === 0) {
			alert("Game Over! You've lost all your lives.");
			return;
		}
	}

	displayNewFlag();
	selectedButton = null;
}

// Function to display a new flag and options
function displayNewFlag() {
	let availableCountries = countries.filter(
		(country) => !usedCountries.includes(country.name)
	);

	if (availableCountries.length === 0) {
		alert("Game Over! You've seen all the flags.");
		return;
	}

	let shuffledAvailableCountries = shuffle(availableCountries.slice());
	let correctCountry = shuffledAvailableCountries[0];
	currentFlag = correctCountry;
	usedCountries.push(correctCountry.name);

	let incorrectCountries = shuffle(
		countries.filter((country) => country.name !== correctCountry.name)
	).slice(0, 3);

	let options = shuffle([correctCountry, ...incorrectCountries]);

	displayFlag(correctCountry.flag);
	displayOptions(options);
}

// Function to update lives (heart display)
function updateLivesDisplay() {
	const livesContainer = document.getElementById("lives-container");
	livesContainer.innerHTML = ""; // Clear the previous hearts

	for (let i = 0; i < 3; i++) {
		let heartImage = document.createElement("img");
		if (i < playerLives) {
			heartImage.src = redHeart;
		} else {
			heartImage.src = grayHeart;
		}
		heartImage.className = "heart";
		livesContainer.appendChild(heartImage);
	}
}

// Shuffle function
function shuffle(array) {
	let currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}
