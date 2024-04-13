import attributesArray from './biscuitImageData.js';

class GameManager {
    constructor(gameOutcomeCallback, setFeedback) {
        this.gameOutcomeCallback = gameOutcomeCallback;
        this.setFeedback = setFeedback;  
        this.initGame();
    }

    initGame() {
        this.computerChoice = attributesArray.map(category => Math.floor(Math.random() * category.length));
        this.playerGuessesCount = 0;
        this.maxGuesses = 10;
        this.isGameOver = false;
        console.log(`Computer's choice (for debugging): ${this.computerChoice}`);
    }

    playerMakesGuess(playerChoice) {
        if (this.isGameOver) {
            this.setFeedback("Game over. Please restart to play again.");
            return 0;  
        }

        this.playerGuessesCount++;
        let correctCount = playerChoice.reduce((count, choice, index) =>
            count + (choice === this.computerChoice[index] ? 1 : 0), 0);

        this.setFeedback(`You got ${correctCount} attributes correct.`);
        if (correctCount === this.computerChoice.length) {
            this.isGameOver = true;
            this.gameOutcomeCallback(true, true);
        } else if (this.playerGuessesCount >= this.maxGuesses) {
            this.isGameOver = true;
            this.gameOutcomeCallback(false, true);
        }
        return correctCount;  
    }
}


export default GameManager;
