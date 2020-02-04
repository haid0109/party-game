const express = require("express");

let game = null;
//TODO: on join player, add player to game object

let app = express();

app.post("/game/current", (req, res) => {
    game = {
        players: [],
    };
    res.send();
});

app.get("/game/current", (req, res) => {
    if(game == null){res.status(404).send("item not found!");}
    else{
        res.send(game);
    }
});

app.post("/game/current/player", express.json(), (req, res) => {
    if(game == null){res.status(404).send("item not found!");}
    else{
        game.players.push(req.body);
        res.send();
    }
});

app.listen(9423);
