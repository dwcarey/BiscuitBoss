import { useState, useEffect, useRef } from 'react';
import './MainContent.css';
import attributesArray from './biscuitImageData.js';
import GameManager from './GameManager';

function MainContent() {
    const [playerChoices, setPlayerChoices] = useState(Array(attributesArray.length).fill(null));
    const [feedbackText, setFeedbackText] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [baseShape, setBaseShape] = useState(0);
    const [lastGuesses, setLastGuesses] = useState(Array(9).fill(null)); 
    const gameManagerRef = useRef(null);

    const basePath = `/baseOption-${playerChoices[0] + 1}.png`;
    const flavourPath = `/flavour${baseShape + 1}-Option-${playerChoices[1] + 1}.png`;
    const icingPath = `/icing${baseShape + 1}-Option-${playerChoices[2] + 1}.png`;
    const toppingPath = `/toppingOption-${playerChoices[3] + 1}.png`;

    useEffect(() => {
        if (!gameManagerRef.current && gameStarted) {
            gameManagerRef.current = new GameManager(setGameOutcome);
        }
    }, [gameStarted]);

    const setGameOutcome = (win, gameOver) => {
        setIsWin(win);
        setIsGameOver(gameOver);
        setGameStarted(false);
    };

    const handleOptionClick = (categoryIndex, optionIndex) => {
        const newChoices = [...playerChoices];
        newChoices[categoryIndex] = optionIndex;
        setPlayerChoices(newChoices);

        if (categoryIndex === 0) {
            setBaseShape(optionIndex);
        }
    };

    const handleSubmitGuess = () => {
        if (playerChoices.includes(null)) {
            setFeedbackText("Please select one of each option before guessing!");
        } else {
            if (gameManagerRef.current) {
                const correctCount = gameManagerRef.current.playerMakesGuess(playerChoices);
                const guessSummary = {
                    choices: [...playerChoices],
                    baseShape: baseShape, 
                    feedback: `${correctCount} Correct`
                };
                const newLastGuesses = [...lastGuesses.slice(1), guessSummary];
                setLastGuesses(newLastGuesses);
            }
        }
    };


    const startGame = () => {
        setIsGameOver(false);
        setIsWin(false);
        setPlayerChoices(Array(attributesArray.length).fill(null));
        setGameStarted(true);
        setLastGuesses(Array(9).fill(null));
        setBaseShape(0);
        setFeedbackText('Customise your biscuit and submit a guess!');
        gameManagerRef.current = new GameManager(setGameOutcome, setFeedbackText); 
    };

    const gameModal = (title, message) => (
        <div className="modal">
            <div className="modalContent">
                <h2>{title}</h2>
                <p>{message}</p>
                <button className="startGameButton" onClick={startGame}>Start New Game</button>
            </div>
        </div>
    );

    return (
        <main className="section">
            {!gameStarted && !isGameOver && (
                <div className="modal">
                    <div className="modalContent">
                        <h2>Welcome to the Game!</h2>
                        <p>Click the button below to start playing.</p>
                        <button className="startGameButton" onClick={startGame}>Start Game</button>
                    </div>
                </div>
            )}

            {gameStarted && (
                <div className="appContainer">
                    <div className="optionsUI">
                        {attributesArray.map((category, categoryIndex) => (
                            <div key={categoryIndex}>
                                <h4>{["Biscuit Shape", "Biscuit Flavour", "Icing Flavour", "Topping Type"][categoryIndex]}</h4>
                                {category.map((option, optionIndex) => (
                                    <button
                                        className={`optionButton ${playerChoices[categoryIndex] === optionIndex ? "selected" : ""}`}
                                        id={`${["base", "flavour", "icing", "topping"][categoryIndex]}Option-${optionIndex + 1}`}
                                        key={`${["base", "flavour", "icing", "topping"][categoryIndex]}Option-${optionIndex + 1}`}
                                        onClick={() => handleOptionClick(categoryIndex, optionIndex)}
                                        style={{ backgroundColor: playerChoices[categoryIndex] === optionIndex ? "rgb(16, 44, 87)" : "rgb(71, 147, 175)" }}
                                    >
                                        <img
                                            className="optionImage"
                                            src={`/${["base", "flavour", "icing", "topping"][categoryIndex]}${(categoryIndex === 1 || categoryIndex === 2) ? (baseShape + 1) + '-' : ''}Option-${optionIndex + 1}.png`}
                                            alt={option}
                                        />
                                        {option}
                                    </button>
                                ))}
                            </div>
                        ))}
                        <button className="submitButton" onClick={handleSubmitGuess}>Submit Guess</button>
                    </div>

                    <div className="biscuitContainer">
                        <h4>The Biscuit</h4>
                        <img className="mainBiscuit" src={basePath} alt="Base" />
                        <img className="mainBiscuit" src={flavourPath} alt="Flavour" />
                        <img className="mainBiscuit" src={icingPath} alt="Icing"  />
                        <img className="mainBiscuit" src={toppingPath} alt="Topping"  />
                    </div>

                    <div className="textFeedback">
                        <p id="textFeedback">{feedbackText}</p>
                    </div>

                    <div className="lastGuesses">
                        {lastGuesses.map((guess, index) => guess && (
                            <div key={index} className="lastGuessItem">
                                <img src={`/baseOption-${guess.choices[0] + 1}.png`} alt="Base" className="guessImage" />
                                <img src={`/flavour${guess.baseShape + 1}-Option-${guess.choices[1] + 1}.png`} alt="Flavour" className="guessImage" />
                                <img src={`/icing${guess.baseShape + 1}-Option-${guess.choices[2] + 1}.png`} alt="Icing" className="guessImage" />
                                <img src={`/toppingOption-${guess.choices[3] + 1}.png`} alt="Topping" className="guessImage" />
                                <span>({guess.feedback})</span>
                            </div>
                        ))}
                    </div>

                </div>
            )}

            {isGameOver && isWin && gameModal("Congratulations!", "You've guessed the correct biscuit!")}
            {isGameOver && !isWin && gameModal("Game Over", "You've reached the maximum number of guesses. Try again?")}
        </main>
    );
}

export default MainContent;
