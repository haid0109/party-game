const playerName = new URLSearchParams(window.location.search).get("name");
let roundNum = new URLSearchParams(window.location.search).get("round");
let audioPlayer = document.getElementById("player");

function setData(){
    //displays the round number
    document.getElementById("roundTitle").innerHTML = "Round " + roundNum;

    //gets audio and sets it to the audio tag
    fetch('http://localhost:9423/game/current/roundAudio/' + roundNum)
    .then((resp) => {
        if(resp.status == 404){return alert("something went wrong!");}
        resp.blob().then((audioData) => {
            audioPlayer.src = URL.createObjectURL(audioData);
        });
    })
    .catch((error) => { console.error('Error:', error); });

    //gets audio speed and sets it to the audio tag playrate
    fetch('http://localhost:9423/game/current/roundAudioSpeed/' + roundNum)
    .then((resp) => {
        if(resp.status == 404){return alert("something went wrong!");}
        resp.json().then((audioSpeedObj) => {
            audioPlayer.playbackRate = audioSpeedObj.speed;
        });
    })
    .catch((error) => {console.error('Error: ', error);});
}

function saveTheGuess(){
    guessDataObj = {
        playerName: playerName,
        guess: document.getElementById("guess").value,
    }

    fetch('http://localhost:9423/game/current/saveTheGuess', {
        method:"POST",  
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guessDataObj)
    })
    .catch((error) => { console.error('Error:', error); });
}

function checkIfNewGameStarted(){
    fetch('http://localhost:9423/game/current/playerExist/' + playerName)
    .then((resp) => {
        if(resp.status == 404){
            window.location.href = "index.html" + "?newGame=true";
        }
    })
    .catch((error) => {console.error('Error: ', error);});
}

window.addEventListener("load", () => {
    setData();
    checkIfNewGameStarted();
    setInterval(checkIfNewGameStarted, 5000);
});

document.getElementById("answer").addEventListener("click", function(){
    saveTheGuess();
    window.location.href = "awaitingAnswers.html" + window.location.search;
});
