import { Animation } from "./src/animation.js";

const canvas = document.getElementById("background");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const animation = new Animation(canvas);
animation.start();
