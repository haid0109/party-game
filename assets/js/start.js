const express = require("express");
const path = require('path');
const busboy = require('express-busboy');
const fs = require('fs');
const app = express();

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

app.post("/game/current/postAudio", async (req, res) => {
    let parsedPlayerData = JSON.parse(req.body.playerData);
    let correctAnswer = parsedPlayerData.answer;
    playerName = parsedPlayerData.name;
    let audioData = req.files.audio;

    loopPlayerNames: for(let arrayIndex = 0; arrayIndex < game.players.length; arrayIndex++){
        if(game.players[arrayIndex].name == playerName){
            game.players[arrayIndex].audio = audioData;
            game.players[arrayIndex].answer = correctAnswer;
            game.players[arrayIndex].playerReady = true;
            game.numberOfRounds++;
            res.status(200);
            break loopPlayerNames;
        }
        else{res.status(404);}
    }

    res.send();
});

app.get("/game/current/getAudio", (req, res) => {
    loopPlayerNames: for(let arrayIndex = 0; arrayIndex < game.players.length; arrayIndex++){
        if(game.players[arrayIndex].name == playerName){
            let path = game.players[arrayIndex].audio.file;
            let contentsOfPath = fs.readFileSync(path);
            res.send(contentsOfPath);
            res.status(200);
            break loopPlayerNames;
        }
        else{res.status(404);}
    }
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
