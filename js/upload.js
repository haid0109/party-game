const secretKey = new URLSearchParams(window.location.search).get("secretKey");
const gameCode = new URLSearchParams(window.location.search).get("code");
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

let correctAnswer = null;
let audioSpeed = 1;
let audioReverse = false;

let getUserMediaStream;
let recordJsObj;

async function checkIfPlayerAndGameExist(){
    await fetch(`http://localhost:9423/game/player/exist/${gameCode}/${secretKey}`)
    .then((resp) => {
        if(resp.status == 404){window.location.href = "index.html" + "?kicked=gameNull";}
        if(resp.status == 403){window.location.href = "index.html" + "?kicked=playerNull";}
    })
    .catch((error) => {console.error('Error: ', error);});
}

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

    if(slowDownBtn.style.display == "none"){addEffectBtn.style.display = "block";}
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
    //creates an object which contains the meta data of the audio, and converts it to JSON 
    let audioMetaData = {
        answer: correctAnswer,
        speed: audioSpeed,
        reverse: audioReverse,
    };
    let stringifiedAudioMetaData = JSON.stringify(audioMetaData);

    //creates a formdata instance and populates it with the audio blob
    let audioFormData = new FormData();
    audioFormData.append("audio", audioBlob, "audio.wav");
    audioFormData.append("audioMetaData", stringifiedAudioMetaData);

    //posts the audio blob as formdata to the server
    await fetch(`http://localhost:9423/game/player/audio/${gameCode}/${secretKey}`, {
        method: 'POST',
        body: audioFormData
    })
    .then((resp) => {console.log("post audio: ", resp.status);})
    .catch((error) => { console.error('Error:', error); });

    //gets the audio blob from the server and populates an audio tag in the frontend with it
    await fetch(`http://localhost:9423/game/player/audio/data/${gameCode}/${secretKey}`)
    .then((resp) => {
        console.log("get audio: ", resp.status);
        resp.blob().then((audioData) => {
            audioPlayer.src = URL.createObjectURL(audioData);
        });
    })
    .catch((error) => {console.error('Error: ', error);});

    //gets the audio speed from the server and sets the playbackRate on the audio tag
    fetch(`http://localhost:9423/game/player/audio/metaData/${gameCode}/${secretKey}`)
    .then((resp) => {
        console.log("get audio speed: ", resp.status);
        resp.json().then((audioMetaData) => {
            audioPlayer.playbackRate = audioMetaData.speed;
        });
    })
    .catch((error) => {console.error('Error: ', error);});
}

window.addEventListener("load", async () => {
    await checkIfPlayerAndGameExist();
    checkCompatibility();
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
uploadAudioBtn.addEventListener("click", async () => {
    await recordJsObj.exportWAV(handleDataUpload);
    finishedBtn.style.display = "block";
});
finishedBtn.addEventListener("click", () => {
    fetch(`http://localhost:9423/game/player/ready/${gameCode}/`,
    {
        method:"PUT",
    })
    .then((response) => {
        if(response.status == 404){return alert("all players must be ready to start the game");}
        window.location.href = "playerGuess.html" + window.location.search + "&round=1";
    })
    .catch((error) => { console.error('Error:', error); });
    window.location.href = "waitingRoom.html" + window.location.search;
});
