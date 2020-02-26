async function guessCheck(){
    await fetch('')
    .then((response) => {
        var checkTheGuess = document.getElementById("playerGuess").value;
        var correctAnswer = "gris";


        if(checkTheGuess == correctAnswer) {
            document.getElementById("test").innerHTML = "Correct answer!";
        } else {
            document.getElementById("test").innerHTML = "Wrong answer!";
        }
    })
    .catch((error) => { console.error('Error:', error); });

}

