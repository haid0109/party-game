function displayPlayersInColumn1(){
    fetch('http://localhost:9423/game/current')
    .then((resp) => {return resp.json()})
    .then((game) => {
        let players = game.players;
        var elements = players.map(player =>   `<div class="player-wrapper">
                                                    <img src = "" alt = "">
                                                    <div class="player-text">
                                                        <p>player 1</p>
                                                        <p>${player.name}</p>
                                                    </div>                       
                                                </div >`    
        ).join("");
        document.getElementById("col-1").innerHTML = elements;
    })
    .catch((error) => { console.error('Error:', error); });
}

window.addEventListener("load", displayPlayersInColumn1);

window.addEventListener("load", function(){
    setInterval(displayPlayersInColumn1, 5000);
});
