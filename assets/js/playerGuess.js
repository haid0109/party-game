function guessCheck(){
    var checkTheGuess = document.getElementById("playerGuess").value;
    var correctAnswer = "gris";


    if(checkTheGuess == correctAnswer) {
        document.getElementById("test").innerHTML = "Correct answer!";
    } else {
        document.getElementById("test").innerHTML = "Wrong answer!";
    }

}