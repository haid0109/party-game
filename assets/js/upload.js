let startBtn = document.getElementById("startButton");
let stopBtn = document.getElementById("stopButton");
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

function handleData(audio){
    let audioPlayer = document.getElementById("player");
    audioPlayer.src = URL.createObjectURL(audio.data);
    
}

var x = document.getElementById("myAudio");

        function setPlaySpeedFast() { 
            x.playbackRate = 2;
        }
        function setPlaySpeedSlow() { 
            x.playbackRate = 0.5;
        }

window.addEventListener("load", checkCompatibility);

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

