let startBtn = document.getElementById("startButton");
let stopBtn = document.getElementById("stopButton");
let speedUpBtn = document.getElementById("speedUpButton")
let reverseBtn = document.getElementById("reverseButton")
let slowDownBtn = document.getElementById("slowDownButton")
let addEffectBtn = document.getElementById("addEffectButton")
let uploadAudioBtn = document.getElementById("uploadAudioButton");
let finishedBtn = document.getElementById("finishedButton");
let audioPlayer = document.getElementById("player");
let effectButtons = document.getElementById("effectButtons")

const playerName = new URLSearchParams(window.location.search).get("name");
let correctAnswer = null;
let audioSpeed = 1;
let audioReverse = false;

let getUserMediaStream;
let recordJsObj;

function checkCompatibility(){
    if (!!navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia({video: false, audio: true}, function(){
            navigator.mediaDevices.enumerateDevices()
            .then(function(devices) {
                for(let index = 0; index < devices.length; index++)
                {
                    if(devices[index].kind == "audioinput") 
                    {
                        startBtn.disabled = false;
                        return;
                    }
                }
                alert("You do not have an audio input plugged into your device. Please plug an audio input and reload the site.");
            })
            .catch(function(err) {
                alert("error: " + err);
            });			
        },
        function()
        { 
            alert("Your browser has blocked microphone access. Change your permissions to allow access to your microphone, and reload the site") 
        });
    } 
    else { alert('Your browser does not support access to your microphone. Update or change browser'); }
}

function startRecording() {
    correctAnswer = document.getElementById("correct").value;
    if(!correctAnswer){
        alert("you need to write a correct answer for your audio");
        return;
    }

    startBtn.disabled = true;
    startBtn.style.backgroundColor  = "rgb(30, 43, 55)";
    stopBtn.disabled = false;
    stopBtn.style.backgroundColor  = "rgb(49, 69, 89)";

    let options = {
        audio: true,
        video: false
    };

    navigator.mediaDevices.getUserMedia(options)
    .then(function(stream) {
        getUserMediaStream = stream;
        let audioCtx = new AudioContext;
        let sourceNode = audioCtx.createMediaStreamSource(stream);
        recordJsObj = new Recorder(sourceNode, { numChannels: 2 });
        recordJsObj.record();
    })
    .catch(function(err) {
        startBtn.disabled = false;
        startBtn.style.backgroundColor  = "rgb(49, 69, 89)";
        stopBtn.disabled = true;
        stopBtn.style.backgroundColor  = "rgb(30, 43, 55)";
        alert("error: " + err);
    });
}

function stopRecording() {
    correctAnswer = document.getElementById("correct").value;
    if(!correctAnswer){
        alert("you need to write a correct answer for your audio");
        return;
    }
    startBtn.disabled = false;
    startBtn.style.backgroundColor  = "rgb(49, 69, 89)";
    stopBtn.disabled = true;
    stopBtn.style.backgroundColor  = "rgb(30, 43, 55)";
    recordJsObj.stop(); 
    getUserMediaStream.getAudioTracks()[0].stop();
    recordJsObj.exportWAV((audioBlob) => {
        audioPlayer.src = URL.createObjectURL(audioBlob);
    })

    addEffectBtn.style.display = "block";
    uploadAudioBtn.style.display = "block";
}

function slowDownAudio(){
    finishedBtn.style.display = "none";
    if(audioSpeed == 0.5){ 
        audioSpeed = 1;
        slowDownBtn.style.backgroundColor = "rgb(49, 69, 89)";
    }
    else { 
        audioSpeed = 0.5;
        speedUpBtn.style.backgroundColor = "rgb(49, 69, 89)";
        slowDownBtn.style.backgroundColor = "rgb(30, 43, 55)";
    }
}

function speedUpAudio(){
    finishedBtn.style.display = "none";
    if(audioSpeed == 2.5){ 
        audioSpeed = 1;
        speedUpBtn.style.backgroundColor = "rgb(49, 69, 89)";
    }
    else { 
        audioSpeed = 2.5;
        slowDownBtn.style.backgroundColor = "rgb(49, 69, 89)";
        speedUpBtn.style.backgroundColor = "rgb(30, 43, 55)";
    }
}

function reverseAudio(){
    finishedBtn.style.display = "none";
    if(audioReverse == true){ 
        audioReverse = false;
        reverseBtn.style.backgroundColor = "rgb(49, 69, 89)";
    }
    else { 
        audioReverse = true;
        reverseBtn.style.backgroundColor = "rgb(30, 43, 55)";
    }
}

async function handleDataUpload(audioBlob){ 
    //creates an object which contains the player name and correct answer, and converts it to JSON 
    let playerData = {
        name: playerName,
        answer: correctAnswer,
        speed: audioSpeed,
        reverse: audioReverse,
    };
    let stringifiedPlayerData = JSON.stringify(playerData);

    //creates a formdata instance and populates it with the audio blob
    let audioFormData = new FormData();
    audioFormData.append("audio", audioBlob, "audio.wav");
    audioFormData.append("playerData", stringifiedPlayerData);

    //posts the audio blob as formdata to the server
    await fetch('http://localhost:9423/game/current/postAudio', {
        method: 'POST',
        body: audioFormData
    })
    .then((resp) => {console.log("post audio: ", resp.status);})
    .catch((error) => { console.error('Error:', error); });

    //gets the audio blob from the server and populates an audio tag in the frontend with it
    await fetch('http://localhost:9423/game/current/getAudio/' + playerName)
    .then((resp) => {
        console.log("get audio: ", resp.status);
        resp.blob().then((audioData) => {
            audioPlayer.src = URL.createObjectURL(audioData);
        });
    })
    .catch((error) => {console.error('Error: ', error);});

    //gets the audio speed from the server and sets the playbackRate on the audio tag
    fetch('http://localhost:9423/game/current/getAudioSpeed/' + playerName)
    .then((resp) => {
        console.log("get audio speed: ", resp.status);
        resp.json().then((audioSpeedObj) => {
            audioPlayer.playbackRate = audioSpeedObj.speed;
        });
    })
    .catch((error) => {console.error('Error: ', error);});
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

window.addEventListener("load", checkCompatibility);
window.addEventListener("load", () => {
    checkIfNewGameStarted();
    setInterval(checkIfNewGameStarted, 5000)
});
startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);
speedUpBtn.addEventListener("click", speedUpAudio);
reverseBtn.addEventListener("click", reverseAudio);
slowDownBtn.addEventListener("click", slowDownAudio);
addEffectBtn.addEventListener("click", () => {
    addEffectBtn.style.display = "none";
    slowDownBtn.style.display = "block";
    reverseBtn.style.display = "block";
    speedUpBtn.style.display = "block";

})
uploadAudioBtn.addEventListener("click", () => {
    recordJsObj.exportWAV(handleDataUpload);
    finishedBtn.style.display = "block";
});
finishedBtn.addEventListener("click", () => {
    window.location.href = "waitingRoom.html" + window.location.search;
});
