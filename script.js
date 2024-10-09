// Declare selectedButton, currentFlag, and player lives in the global scope
let selectedCountryButton = null;
let selectedCapitalButton = null;
let currentFlag = null;
let usedCountries = [];
let playerLives = 3;

// Add the paths for the heart images
const redHeart = "./assets/Icons/red-heart.png";
const grayHeart = "./assets/Icons/gray-heart.png";

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
	document.getElementById("startScreen").classList.add("hard-mode");
	console.log("Hard mode selected");
});

document.getElementById("playButton").addEventListener("click", function () {
	showScreen("playScreen");
});

function showScreen(screenId) {
	const screens = document.querySelectorAll(".screen");
	screens.forEach((screen) => {
		screen.style.display = "none";
		screen.classList.remove("hard-mode");
	});
	document.getElementById(screenId).style.display = "flex";
}

function startGame(difficulty) {
	console.log("Selected Difficulty:", difficulty);
	showScreen("startScreen");
	fetchCountries(difficulty);
	updateLivesDisplay();
	player.difficulty = difficulty;
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
function fetchCountries(difficulty) {
	fetch("./data/countries.json")
		.then((response) => response.json())
		.then((data) => {
			countries = data;
			initGame(countries, difficulty);
		})
		.catch((error) => {
			console.error("Error loading countries:", error);
		});
}

// Function to initialize the game
function initGame(countries, difficulty) {
	displayNewFlag(difficulty);
}

// Modified function to display flag and both country & capital buttons
function displayNewFlag(difficulty) {
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

	// Call the modified function to display two sets of buttons
	if (difficulty === "hard") {
		displayCountryAndCapitalOptions(options);
	} else {
		displayCountryOptions(options);
	}
}

function displayFlag(flagUrl) {
	let flagDisplay = document.getElementById("flag-display");
	flagDisplay.innerHTML = "";

	let flagImage = document.createElement("img");
	flagImage.src = flagUrl;
	flagImage.className = "flag";
	flagDisplay.appendChild(flagImage);
}

// Display only country options for easy mode
function displayCountryOptions(options) {
	let gameBoard = document.getElementById("game-board");
	gameBoard.innerHTML = "";

	options.forEach((country) => {
		let button = document.createElement("button");
		button.classList.add("countryBtn");
		button.textContent = country.name;
		button.dataset.country = country.name;
		button.addEventListener("click", handleCountryClick);
		gameBoard.appendChild(button);
	});
}

// Display separate buttons for country and capital for hard mode
function displayCountryAndCapitalOptions(options) {
	let gameBoard = document.getElementById("game-board");
	gameBoard.innerHTML = "";

	let countryBoard = document.createElement("div");
	let capitalBoard = document.createElement("div");

	let allCapitals = countries.map((country) => country.capital);

	options.forEach((country) => {
		let countryButton = document.createElement("button");
		countryButton.classList.add("countryBtn");
		countryButton.textContent = country.name;
		countryButton.dataset.country = country.name;
		countryButton.addEventListener("click", handleCountryClick);
		countryBoard.appendChild(countryButton);
	});

	// Add the correct capital to the list of options
	let correctCapital = currentFlag.capital;
	let capitalOptions = [correctCapital];

	// Select random capitals for incorrect answers
	while (capitalOptions.length < 4) {
		let randomCapital =
			allCapitals[Math.floor(Math.random() * allCapitals.length)];
		// Ensure the same capital isn't selected twice
		if (!capitalOptions.includes(randomCapital)) {
			capitalOptions.push(randomCapital);
		}
	}

	// Shuffle the capital options so the correct capital is randomly placed
	capitalOptions = shuffle(capitalOptions);

	capitalOptions.forEach((capital) => {
		let capitalButton = document.createElement("button");
		capitalButton.classList.add("capitalBtn");
		capitalButton.textContent = capital;
		capitalButton.dataset.capital = capital;
		capitalButton.addEventListener("click", handleCapitalClick);
		capitalBoard.appendChild(capitalButton);
	});

	gameBoard.appendChild(countryBoard);
	gameBoard.appendChild(capitalBoard);
}

// Function to handle country click
function handleCountryClick() {
	if (!selectedCountryButton) {
		selectedCountryButton = this;
	}

	// If we're in "easy" mode, we check for a match immediately after selecting the country
	if (player.difficulty === "easy") {
		setTimeout(() => checkForMatch("easy"), 100);
	} else if (player.difficulty === "hard") {
		if (selectedCountryButton && selectedCapitalButton) {
			setTimeout(checkForMatch, 100, "hard");
		}
	}
}

// Function to handle capital click (only in "hard" mode)
function handleCapitalClick() {
	if (!selectedCapitalButton) {
		selectedCapitalButton = this;
	}

	if (selectedCountryButton && selectedCapitalButton) {
		setTimeout(checkForMatch, 100, "hard");
	}
}

function showGameOver() {
	const gameOverOverlay = document.getElementById("gameOverOverlay");
	gameOverOverlay.style.display = "flex";
}

function checkForMatch(difficulty) {
	if (difficulty === "hard") {
		if (
			selectedCountryButton.dataset.country === currentFlag.name &&
			selectedCapitalButton.dataset.capital === currentFlag.capital
		) {
			console.log("Match!");
			player.incrementScore();
			updatePlayerInfo();
		} else {
			console.log("No match!");
			playerLives--;
			updateLivesDisplay();

			if (playerLives === 0) {
				showGameOver();
				return;
			}
		}
	} else {
		// Easy mode check only country
		if (selectedCountryButton.dataset.country === currentFlag.name) {
			console.log("Match!");
			player.incrementScore();
			updatePlayerInfo();
		} else {
			console.log("No match!");
			playerLives--;
			updateLivesDisplay();

			if (playerLives === 0) {
				showGameOver();
				return;
			}
		}
	}

	// Reset for the next round
	selectedCountryButton = null;
	selectedCapitalButton = null;
	displayNewFlag(difficulty);
}

// Function to update lives
function updateLivesDisplay() {
	const livesContainer = document.getElementById("lives-container");
	livesContainer.innerHTML = "";

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

document
	.getElementById("startOverButton")
	.addEventListener("click", function () {
		// Hide the Game Over overlay
		const gameOverOverlay = document.getElementById("gameOverOverlay");
		gameOverOverlay.style.display = "none";

		// Reset game variables
		playerLives = 3; // Reset player lives
		usedCountries = []; // Reset used countries
		selectedCountryButton = null;
		selectedCapitalButton = null;
		player.score = 0; // Reset the player's score

		updatePlayerInfo();
		updateLivesDisplay();

		// Show the difficulty screen to start over
		showScreen("difficultyScreen");
	});
