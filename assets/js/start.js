const express = require("express");
const app = express();
const path = require("path");
const busboy = require("express-busboy");
const fs = require("fs");
const WAA = require("web-audio-api");
const audioBufferToWav = require("audiobuffer-to-wav");

let game = null;

function shuffleArray(array) {
    for (let arrayIndex = 0; arrayIndex < array.length; arrayIndex++) {
        const randomNum = Math.floor(Math.random() * (arrayIndex + 1));
        [array[arrayIndex], array[randomNum]] = [array[randomNum], array[arrayIndex]];
    }
}

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post("/game/current", express.json(), (req, res) => {
    game = {
        state: "initialized",
        players: [],
        numberOfRounds: 0,
        currentRound: 0,
        questionHasBeenAnswered: false,
    };
    game.players.push(req.body);
    game.state = "preround";
    res.send();
});

app.get("/game/current", (req, res) => {
    if(game != null){
        if(game.players.length <= 6){
            res.send(game);
        }
        else{ res.status(403).send("too many players. "+ game.players.length ); }
    }
    else{ res.status(404).send("there is no game"); }
});

app.post("/game/current/player", express.json(), (req, res) => {
    if(game == null){res.status(404).send("there is no game");}
    else{
        if(game.players.length <= 6){
            if(game.state == "preround"){
                game.players.push(req.body);
                res.send();
            }
        }
        else{res.status(403).send("too many players");}
    }
});

busboy.extend(app, {
    upload: true,
    allowedPath: "/game/current/postAudio",
});

app.post("/game/current/postAudio", (req, res) => {
    let parsedPlayerData = JSON.parse(req.body.playerData);
    let playerName = parsedPlayerData.name;
    let correctAnswer = parsedPlayerData.answer;
    let audioSpeed = parsedPlayerData.speed;
    let audioReverse = parsedPlayerData.reverse;
    let audioDataPath = req.files.audio.file;

    //checks if player exists
    let player = game.players.find(player => player.name == playerName);
    if(!player) {
        return res.status(404).send();
    }

    //assigns data
    player.audioPath = audioDataPath;
    player.answer = correctAnswer;
    player.speed = audioSpeed;
    player.reverse = audioReverse;
    player.playerReady = true;
    game.numberOfRounds++;
    
    //reverses audio data
    if(audioReverse){
        let buffer = fs.readFileSync(audioDataPath);
        let audioCtx = new WAA.AudioContext();
        audioCtx.decodeAudioData(buffer, 
            function(audioBuffer) {
                Array.prototype.reverse.call( audioBuffer.getChannelData(0) );
                Array.prototype.reverse.call( audioBuffer.getChannelData(1) );
                let arrayBufferWav = audioBufferToWav(audioBuffer);
                fs.writeFileSync(audioDataPath, Buffer.from(arrayBufferWav));
            },
            function(err){
                console.log("Error with decoding audio data: ", err);
                res.status(500); //does not work
            }
        );
    }
    res.send(); //only sends status 200, even if status is set to 500
});

app.get("/game/current/getAudio/:playerName", (req, res) => {
    let playerName = req.params.playerName
    let player = game.players.find(player => player.name == playerName);
    if(!player) {
        return res.status(404).send();
    }
    let buffer = fs.readFileSync(player.audioPath);
    res.send(buffer);
});

app.get("/game/current/getAudioSpeed/:playerName", (req, res) => {
    let playerName = req.params.playerName
    let player = game.players.find(player => player.name == playerName);
    if(!player) {
        return res.status(404).send();
    }
    res.send({speed: player.speed});
});

app.post("/game/current/start", (req, res) => {
    if(game.state != "in progress"){
        game.state = "in progress";
        shuffleArray(game.players);
    }
    res.status(204).send("game in progress");
});

app.post("/game/current/saveTheGuess", (req, res) =>{
    game.players.playerGuess = [];
    game.playerGuess.push(req.body);
    if(!game.playerGuess){
        res.sendStatus(400, "Invalid or Empty input");    
    }
    res.send("the guess has been posted");
});

app.get("/game/current/question", (req, res) => {
    res.send(game.guessChecker[0]);
});

app.get("/game/current/round", (req, res) => {
    game.currentRound++;
    if(game.currentRound > game.numberOfRounds){
        res.sendStatus(404);
        return;
    }

    let questionData = {
        audio: game.players[game.currentRound -1].audio,
        answer: game.players[game.currentRound -1].answer,
        currentRound: game.currentRound,    
    }

    res.send(questionData);
    return;
})

app.listen(9423);
