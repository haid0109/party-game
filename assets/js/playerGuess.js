const playerName = new URLSearchParams(window.location.search).get("name");
let roundNum = new URLSearchParams(window.location.search).get("round");
let audio = document.getElementById("player");

let allEven = true;

// const players = game.players;

// players.forEach(function() {
//   if (player.questionHasBeenAnswered == false) {
//     startNextRound();
//     return;
//   }
// });

async function startNextRound(){
    await fetch('')
    .then((response) => {
        return response.json();
    })
    .then((startNextRound) => {
        
    })
    .catch((error) => { console.error('Error:', error); });
}

async function getCurrentRound(){
    await fetch('http://localhost:9423/game/current/round')
    .then((response) => {
        return response.json();
    })
    .then((getCurrentRound) => {
        let currentRound = getCurrentRound.currentRound;
        document.getElementById("roundTitle").innerHTML = "Round" + currentRound;
    })
    .catch((error) => { console.error('Error:', error); });
}

async function soundDataFile(){
    await fetch('http://localhost:9423/game/current/getAudio')
    .then((resp) => {
        resp.blob().then((audioData) => {
            console.log(audioData);
            audio.src = URL.createObjectURL(audioData)
            if(!audioData){
                console.log("file not found");
            }        
        }); 
    })
    .catch((error) => { console.error('Error:', error); });
    document.getElementById("player").value = "";
}


async function guessCheck(){
    await fetch('http://localhost:9423/game/current/question')
    .then((response) => {
        return response.json();
    })
    .then((guessChecker) => {
        let playersGuess = document.getElementById("playerGuess").value;
        let correctAnswer = guessChecker.correctAnswer;
        let highscore = 0;
        if(playersGuess == correctAnswer) {
            document.getElementById("test") = highscore++;;
        } else {
            document.getElementById("test") = highscore;
        }
    })
    .catch((error) => { console.error('Error:', error); });
}

window.addEventListener("load", () => getCurrentRound());
window.addEventListener("load", () => soundDataFile());
document.getElementById("begin").addEventListener("click", () => window.location.href = "awaitingAnswers.html" + window.location.search);

