const express = require("express");
const path = require('path');

let game = null;
//TODO: on join player, add player to game object

let app = express();


app.post("/game/current", express.json(), (req, res) => {
    game = {
        players: [],
        status: "initialized",
    };
    game.players.push(req.body);
    game.status = "preround";
    res.send();
});

app.get("/game/current", (req, res) => {
    if(game == null){res.status(404).send("there is no game");}
    else{
        res.send(game);
    }
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

/*
app.get("/", function(req, res) {
    fs.readFile("index.html", function(error, buffer) {
      if(error) {
        return console.log("could not read menu-gen", error);
      }
      res.send(buffer.toString());
    });
  });*/

app.listen(9423);