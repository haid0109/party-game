const playerName = new URLSearchParams(window.location.search).get("name");
let roundNum = new URLSearchParams(window.location.search).get("round");

function soundDataFile(){
    fetch('http://localhost:9423/game/current/getAudio')
    .then((resp) => {
        resp.blob().then((audioData) => {
            audioPlayer.src = URL.createObjectURL(audioData);
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

window.addEventListener("load", () => soundDataFile());
document.getElementById("begin").addEventListener("click", () => window.location.href = "awaitingAnswers.html" + window.location.search);

