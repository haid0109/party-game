const playerName = new URLSearchParams(window.location.search).get("name");
let startBtn = document.getElementById("startButton");
let stopBtn = document.getElementById("stopButton");
let audioPlayer = document.getElementById("player");
let correctAnswer = null;
let recorder;

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
                        startBtn.addEventListener("click", record);
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

function record(){
    correctAnswer = document.getElementById("correct").value;
    if(!correctAnswer){
        alert("you need to write a correct answer for your audio");
        return;
    }
    startBtn.disabled = true;
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then((stream) => {
        recorder = new MediaRecorder(stream);
        recorder.start();
        stopBtn.disabled = false
        stopBtn.addEventListener("click", stopRecording);
        recorder.addEventListener("dataavailable", handleData);
    });
}

function stopRecording(){
    recorder.stop();
    stopBtn.disabled = true;
    startBtn.disabled = false;
}

async function handleData(audio){
    //creates an object which contains the player name and correct answer, and converts it to JSON 
    let playerData = {
        name: playerName,
        answer: correctAnswer,
    }
    let stringifiedPlayerData = JSON.stringify(playerData);

    //creates a formdata instance and populates it with the audio blob
    let audioFormData = new FormData();
    audioFormData.append("audio", audio.data, "audio.mp3");
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
    .catch((error) => { console.error('Error:', error); });
    document.getElementById("correct").value = "";
}

var x = document.getElementById("myAudio");

        function setPlaySpeedFast() { 
            x.playbackRate = 2;
        }
        function setPlaySpeedSlow() { 
            x.playbackRate = 0.5;
        }

window.addEventListener("load", checkCompatibility);
document.getElementById("done").addEventListener("click", () => window.location.href = "waitingRoom.html");

// const player = document.getElementById('player');
// const handleSuccess = function(stream) {
    //     if (window.URL) { player.srcObject = stream; } 
//     else { player.src = stream; }
// };
// navigator.mediaDevices.getUserMedia({ audio: true, video: false })
// .then(handleSuccess);

// let options = { 
        //     audio: true,
        //     video: false
        // };
        
        // navigator.mediaDevices.getUserMedia(options)
        // .then(audioStream => {
        // });

