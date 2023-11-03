import { Animation } from "./src/animation.js";

const canvas = document.getElementById("background");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const animation = new Animation(canvas);
animation.start();

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        console.log("Animation stopped.");
        animation.stop();
    } else {
        console.log("Animation started.");
        animation.start();
    }
});
