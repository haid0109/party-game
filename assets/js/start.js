const express = require("express");
const path = require('path');
const busboy = require('express-busboy');
const fs = require('fs');
const app = express();

let game = null;
let playerName = null;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post("/game/current", express.json(), (req, res) => {
    game = {
        state: "initialized",
        players: [],
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

    loopPlayerNames: for(let arrayIndex = 0; arrayIndex < game.players.length; arrayIndex++){
        if(game.players[arrayIndex].name == playerName){
            game.players[arrayIndex].audio = audioData;
            game.players[arrayIndex].answer = correctAnswer;
            game.players[arrayIndex].playerReady = true;
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
    res.status(204).send("game in progress");
});

app.get("/game/current/question", (req, res) => {
    res.send(game.sound[0]);
});

app.listen(9423);
