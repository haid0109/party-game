const express = require("express");
const path = require('path');

let game = null;
//TODO: on join player, add player to game object

let app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post("/game/current", express.json(), (req, res) => {
    game = {
        players: [],
        status: "initialized",
    };
    game.players.push(req.body);
    game.status = "preround";
    res.send();
});
//
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
            if(game.status == "preround"){
                game.players.push(req.body);
                res.send();
            }
        }
        else{res.status(403).send("too many players");}
    }
});

app.listen(9423);

