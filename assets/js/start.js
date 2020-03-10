const express = require("express");
const path = require('path');
const busboy = require('express-busboy');
const fs = require('fs');
const WAA = require('web-audio-api');
const stream = require('stream');
const app = express();
const audioBufferToWav = require("audiobuffer-to-wav");

let game = null;
let playerName = null;

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
    let correctAnswer = parsedPlayerData.answer;
    let audioData = req.files.audio;
    playerName = parsedPlayerData.name;

    //checks if player exists
    let player = game.players.find(player => player.name == playerName);
    if(!player) {
        return res.status(404).send();
    }

    //assigns data
    player.audio = audioData;
    player.answer = correctAnswer;
    player.playerReady = true;
    game.numberOfRounds++;
    res.send();
});

app.get("/game/current/getAudio", (req, res) => {
    let player = game.players.find(player => player.name == playerName);
    if(!player) {
        return res.status(404).send();
    }

    // works:
    let path = player.audio.file;
    let buffer = fs.readFileSync(path);
    res.send(buffer);

    //works partially:
    // let path = player.audio.file;
    // let path = "/home/alexandra/code/party-game/assets/audio/aud.mp3"
    // let buffer = fs.readFileSync(path);
    // let audioCtx = new WAA.AudioContext();

    // audioCtx.decodeAudioData(buffer, 
    //     function(audioBuffer) {
    //         Array.prototype.reverse.call( audioBuffer.getChannelData(0) );
    //         Array.prototype.reverse.call( audioBuffer.getChannelData(1) );
    //         let audioWav = audioBufferToWav(audioBuffer);
    //         fs.writeFileSync("wavefile-dude.wav", Buffer.from(audioWav));
    //         res.send(Buffer.from(audioWav));
    //     },
    //     function(err){
    //         console.log("Error with decoding audio data: ", err);
    //         res.status(500).send({error: "failed to decode audio"});
    //     }
    // );
});

app.post("/game/current/start", (req, res) => {
    game.state = "in progress";
    shuffleArray(game.players);
    res.status(204).send("game in progress");
});

app.get("/game/current/question", (req, res) => {
    res.send(game.guessChecker[0]);
});

app.get("game/current/round", (req, res) => {
    game.currentRound++;
    if(game.currentRound > game.numberOfRounds){
        res.sendStatus(404);
        return;
    }

    let questionData = {
        audio: game.players[game.currentRound -1].audio,
        answer: game.players[game.currentRound -1].answer,    
    }

    res.send(questionData);
    return;
    
})

app.listen(9423);
