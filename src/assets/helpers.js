export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--){
        let randomIndex = Math.floor(Math.random()*(i + 1));
        let temp = array[randomIndex];
        array[randomIndex] = array[i];
        array[i] = temp;
    }
    return array;
}
export function double(array) {
    let result = [];
    for (let item of array){
        result.push(JSON.parse(JSON.stringify(item)));
        result.push(JSON.parse(JSON.stringify(item)));
    }
    return shuffle(result);
}
export function clockifyTime(time){
    let hours = Math.floor(time/3600);
    hours = (hours < 10) ? "0" + hours : hours;
    let minutes = Math.floor((time % 3600)/60);
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    let seconds = Math.floor(time % 60);
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}
export function stringifyTime(time){
    let hours = Math.floor(time/3600);
    let minutes = Math.floor((time % 3600)/60);
    let seconds = Math.floor(time % 60);

    let string;
    if (time < 1){
        string = "0 seconds";
    } else {
        string = 
            ((hours > 0) ? hours + ((hours > 1) ? " hours" : " hour") : "") +
            ((hours > 0 && minutes > 0) ? ", " : "") +
            ((minutes > 0) ? minutes + ((minutes > 1) ? " minutes" : " minute") : "") +
            ((minutes > 0 && seconds > 0) ? ", " : "") + 
            ((seconds > 0) ? seconds + ((seconds > 1) ? " seconds" : " second") : "");
    }

    return string; 
}