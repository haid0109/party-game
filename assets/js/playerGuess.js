const playerName = new URLSearchParams(window.location.search).get("name");
let roundNum = new URLSearchParams(window.location.search).get("round");
let audio = document.getElementById("player");


async function getCurrentRound(){
    await fetch('http://localhost:9423/game/current/round')
    .then((response) => {
        return response.json();
    })
    .then((round) => {
        document.getElementById("roundTitle").innerHTML = "Round " + round.currentRound;
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


async function saveTheGuess(){
    await fetch('http://localhost:9423/game/current/saveTheGuess', {
        method:"POST",
        body: {
            playerGuess: document.getElementById("playerGuess").value,
        }
    })
    .catch((error) => { console.error('Error:', error); });
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
document.getElementById("makeAGuess").addEventListener("click", async function(){
    await saveTheGuess();
    // window.location.href = "awaitingAnswers.html" + window.location.search
});
