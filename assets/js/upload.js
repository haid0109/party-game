let startBtn = document.getElementById("startButton");
let stopBtn = document.getElementById("stopButton");
let speedUpBtn = document.getElementById("speedUpButton")
let reverseBtn = document.getElementById("reverseButton")
let slowDownBtn = document.getElementById("slowDownButton")
let uploadAudioBtn = document.getElementById("uploadAudioButton");
let audioPlayer = document.getElementById("player");
let finishedBtn = document.getElementById("finishedButton");

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
    stopBtn.disabled = false;
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
        stopBtn.disabled = true;
        alert("error: " + err);
    });
}

function stopRecording() {
    correctAnswer = document.getElementById("correct").value;
    if(!correctAnswer){
        alert("you need to write a correct answer for your audio");
        return;
    }
    
    stopBtn.disabled = true;
    startBtn.disabled = false;
    recordJsObj.stop(); 
    getUserMediaStream.getAudioTracks()[0].stop();

    speedUpBtn.disabled = false;
    reverseBtn.disabled = false;
    slowDownBtn.disabled = false;
    uploadAudioBtn.disabled = false;
}

function speedUpAudio(){
    if(audioSpeed == 0.5){ audioSpeed = 1; }
    else { audioSpeed = 0.5; }
}

function reverseAudio(){
    if(audioReverse == true){ audioReverse = false; }
    else { audioReverse = true; }
}

function slowDownAudio(){
    if(audioSpeed == 2.5){ audioSpeed = 1; }
    else { audioSpeed = 2.5; }
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
    .then((resp) => {console.log(resp.status);})
    .catch((error) => { console.error('Error:', error); });

    //gets the audio blob from the server and populates an audio tag in the frontend with it
    fetch('http://localhost:9423/game/current/getAudio')
    .then((resp) => {
        resp.blob().then((audioData) => {
            audioPlayer.src = URL.createObjectURL(audioData);
        });
    })
    .catch((error) => {console.error('Error: ', error);});
}

window.addEventListener("load", checkCompatibility);
startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);
speedUpBtn.addEventListener("click", speedUpAudio);
reverseBtn.addEventListener("click", reverseAudio);
slowDownBtn.addEventListener("click", slowDownAudio);
uploadAudioBtn.addEventListener("click", () => {
    recordJsObj.exportWAV(handleDataUpload);
    finishedBtn.disabled = false;
});
finishedBtn.addEventListener("click", () => {
    window.location.href = "waitingRoom.html" + window.location.search;
});
