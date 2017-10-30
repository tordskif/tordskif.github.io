function setup() {
    setInterval(playsound, 500)
    
    let soundcount = 0;
    function playsound() {
        soundcount++;
        if(soundcount == 3) {
            var audio = new Audio('crashsound.mp3');
            audio.play();
        }
        if(soundcount == 8) {
            soundcount = 0;
        }
    }
}