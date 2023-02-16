import QuizQuestion from "./modules/QuizQuestion.js"


let q1 = new QuizQuestion("TallShakingPresidentDuDudu-EydbJXbRqN0YNc2C", ["Taz", "Mak"], true)

let q2 = new QuizQuestion("SmellyAdventurousDisc4Head-P3F0N00hryWHpAzb", ["Taz", "Hardy"], true)

let q3 = new QuizQuestion("1040978827", ["Katmai"], false)

let list = [q1,q2,q3]

document.getElementById("testButton").addEventListener("click", setRandomVideo)

function setRandomVideo() {
    let randomNum = Math.floor(Math.random()*list.length)
    let randomVideoId = list[randomNum]
    setVideo(randomVideoId)
}

function setVideo(quizQuestion) { //Take in quiz question, set appropriate video
    //Maybe reset time on current video first before playing a new one?
    let videoPlayer = document.getElementById("videoPlayer")

    //Need to use different format depending if the video is a clip, or a highlight
    let srcString
    if(quizQuestion.isClip) {
        srcString = "https://clips.twitch.tv/embed?clip=" + quizQuestion.id + "&parent=127.0.0.1&tordskif.github.io&muted=true&autoplay=true"
    } else {
        srcString = "https://player.twitch.tv/?video=" + quizQuestion.id + "&parent=127.0.0.1&tordskif.github.io&autoplay=true&muted=true&time=0h0m0s"
    }


    console.log(videoPlayer)
    videoPlayer.src = srcString
}