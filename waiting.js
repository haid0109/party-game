window.onload = async function () {

    await fetch('http://localhost:9423/game/current')
        .then((response) => {
            return response.json();
            
        })
        .then((game) => {
            let players = game.players;

            var elements = players.map(player => `<div class="player-wrapper">
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



};