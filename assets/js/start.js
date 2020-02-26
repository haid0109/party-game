const express = require("express");
const path = require('path');
const busboy = require('express-busboy');
const app = express();

let game = null;
let sounds = [];

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post("/game/current", express.json(), (req, res) => {
    game = {
        players: [],
        state: "initialized",
        sound: [
            {
                correctAnswer: "gris"
            }
        ],
    };
    game.players.push(req.body);
    game.state = "preround";
    res.send();
});

app.get("/game/current", (req, res) => {
    if(game != null){
        if(game.players.length <=6){
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
    allowedPath: "/game/current/audio",
});

app.post("/game/current/audio", (req, res) => {
    sounds.push(req.files);
    game.sound.push(req.files);
    res.send();
});

app.get("/game/current/audio", (req, res) => {
    res.send(sounds);
});

app.post("/game/current/start", (req, res) => {
    game.state = "in progress";
    res.send(204);
});

app.get("/game/current/question", (req, res) => {
    res.send(game.sound[0]);
});

// app.use(function(req, res, next){
//     res.send(404);
// });

app.listen(9423);

