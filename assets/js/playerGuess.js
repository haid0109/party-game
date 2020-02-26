async function guessCheck(){
    await fetch('http://localhost:9423/game/current/question')
    .then((response) => {
        return response.json();

    }).then((sound) => {
        var checkTheGuess = document.getElementById("playerGuess").value;
        let correctAnswer = sound.correctAnswer;

        if(checkTheGuess == correctAnswer) {
            document.getElementById("test").innerHTML = "Correct answer!";
        } else {
            document.getElementById("test").innerHTML = "Wrong answer!";
        }
    })
    .catch((error) => { console.error('Error:', error); });
}

