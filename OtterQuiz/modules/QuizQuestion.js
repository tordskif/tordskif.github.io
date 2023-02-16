export default class QuizQuestion {
    constructor(id, otterList, isClip = true) {
        //videoId is the id of the clip/video, otterList is an array of strings with the names of the otters in the clip/video
        this.id = id
        this.otterList = otterList
        this.isClip = isClip
    }
}