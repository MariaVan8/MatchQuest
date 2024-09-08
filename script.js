// Declare selectedButton and currentFlag in the global scope
let selectedButton = null;
let currentFlag = null;

document.getElementById("startButton").addEventListener("click", function () {
	showScreen("joinScreen");
});

document.getElementById("joinButton").addEventListener("click", function () {
	const playerName = document.getElementById("playerName").value;
	if (playerName) {
		// Create a new player with the entered name
		player = new Player(playerName);

		// Update the welcome message in the difficulty screen
		showScreen("difficultyScreen");
		const welcomeMessage = document.createElement("p");
		welcomeMessage.innerText = `Welcome, ${playerName}! Please choose a difficulty:`;
		const heading = document.querySelector("#difficultyScreen h2");
		heading.insertAdjacentElement("afterend", welcomeMessage);

		// Update the player name on the startScreen
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
			// Assign the fetched data to the global countries variable
			countries = data;
			initGame(countries); // Initialize the game with the fetched countries
		})
		.catch((error) => {
			console.error("Error loading countries:", error);
		});
}

function initGame(countries) {
	// Shuffle the countries array
	let shuffledCountries = shuffle(countries.slice());

	// Select the correct country (first in the shuffled array)
	let correctCountry = shuffledCountries[0];

	// Set currentFlag to the correct country
	currentFlag = correctCountry;

	// Select 3 random incorrect countries (from the rest of the array)
	let incorrectCountries = shuffledCountries.slice(1); // Exclude the correct answer
	incorrectCountries = shuffle(incorrectCountries).slice(0, 3); // Pick 3 random incorrect countries

	// Combine correct answer and incorrect answers
	let options = shuffle([correctCountry, ...incorrectCountries]); // Shuffle so correct answer is randomly placed

	// Display the flag of the correct country
	displayFlag(correctCountry.flag);

	// Create buttons for the 4 options (1 correct, 3 incorrect)
	displayOptions(options);
}

// Function to display the flag
function displayFlag(flagUrl) {
	let flagDisplay = document.getElementById("flag-display");
	flagDisplay.innerHTML = ""; // Clear the previous flag

	let flagImage = document.createElement("img");
	flagImage.src = flagUrl;
	flagImage.className = "flag";
	flagDisplay.appendChild(flagImage);
}

// Function to display the 4 options
function displayOptions(options) {
	let gameBoard = document.getElementById("game-board");
	gameBoard.innerHTML = ""; // Clear the previous buttons

	options.forEach((country) => {
		let button = document.createElement("button");
		button.textContent = country.name;
		button.dataset.country = country.name;
		button.addEventListener("click", handleButtonClicked);
		gameBoard.appendChild(button);
	});
}

// Function to handle button clicks
function handleButtonClicked() {
	if (!selectedButton) {
		// First button clicked
		selectedButton = this;
		console.log("First button clicked");

		// Check for match
		setTimeout(checkForMatch, 500);
	}
}

// Function to check if the selected option matches the current flag
function checkForMatch() {
	if (
		currentFlag &&
		selectedButton &&
		selectedButton.dataset.country === currentFlag.name
	) {
		console.log("Match!");
		player.incrementScore();
		updatePlayerInfo(); // Update player score on the screen
	} else {
		console.log("No match!");
	}

	// After checking, show the next flag
	displayNewFlag();
	selectedButton = null; // Reset selectedButton for the next round
}

// Function to display a new flag and options
function displayNewFlag() {
	// Shuffle the countries array
	let shuffledCountries = shuffle(countries.slice());

	// Select the correct country (first in the shuffled array)
	let correctCountry = shuffledCountries[0];
	currentFlag = correctCountry;

	// Select 3 random incorrect countries (from the rest of the array)
	let incorrectCountries = shuffledCountries.slice(1); // Exclude the correct answer
	incorrectCountries = shuffle(incorrectCountries).slice(0, 3); // Pick 3 random incorrect countries

	// Combine correct answer and incorrect answers
	let options = shuffle([correctCountry, ...incorrectCountries]); // Shuffle so correct answer is randomly placed

	// Display the flag of the correct country
	displayFlag(correctCountry.flag);

	// Create buttons for each option (1 correct, 3 incorrect)
	displayOptions(options);
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
