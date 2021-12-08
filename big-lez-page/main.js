// generate 100 stars/ SPECIFICATION:
/* 
height width witdh > 50% < 200% && within 10% of each other
gridArea placement must be unique, and have relationship so they only match on mb side :)
*/
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
let starRow = () => getRandomInt(1, 90);
let starCol = (y) =>
  getRandomInt(
    Math.floor(
      (((8893 * (y - 86)) / 111622680 + 452 / 76245) * (y - 40) - 40 / 39) *
        (y - 1) +
        165
    ),
    200
  );
let starSize = () => getRandomInt(1, 80);
let starColor = () => getRandomInt(0, 8);
let variationCoeff = (per) => getRandomInt(per, 100) / 100;
const colors = [
  "lavender",
  "thistle",
  "plum",
  "violet",
  "orchid",
  "fuchsia",
  "magenta",
  "mediumorchid",
  "mediumpurple",
];

// STARS
//((79 * (y - 40)) / 5865 - 5 / 3) * (y - 1) + 190
let coordList = [];
const darkSky = document.querySelector(".bg.sky");
function starGenerator(count) {
  const stars = document.querySelectorAll(".bg.star");
  let starsList = Array.from(stars);
  starsList.forEach((star) => darkSky.removeChild(star));
  for (let i = 0; i < count; i++) {
    // removing existing clouds
    // adding new clouds
    let newStar = document.createElement("div");
    newStar.classList.add(`bg`, `star`, `${i}`);
    let y = starRow();
    let x = starCol(y);
    let size = starSize();
    let color = starColor();
    let V = variationCoeff(80);

    coordList = [...coordList, [x, y]];
    newStar.style.cssText = `grid-area: ${y} / ${x} / ${y} / ${x}; 
    height: ${size * 0.87}%;
    width: ${size}%;
    background-color: ${colors[color]};
    opacity: ${V * 100}%;
    border-radius: 100%;
    box-shadow: 0 0 ${1.3 * V}vh ${0.2 * V}vh ${colors[color]}; 
  `;
    darkSky.appendChild(newStar);
  }
  const starCount = document.querySelectorAll(".bg.star").length;
  console.log("stars: ", starCount);
}

starGenerator(300);

// CLOUDS
// root.style.setProperty("--mouse-x", e.clientX + "px");
let cloudY = () => getRandomInt(0, 40);
let cloudDelay = () => getRandomInt(x, y);
const BASE_TIME = 100;
const BASE_SCALE = 0.9;

const sky = document.querySelector(".bg.rainbow");
let index = 1;
function cloudGenerator(count) {
  // removing existing clouds
  const clouds = document.querySelectorAll(".fg.cloud");
  let cloudList = Array.from(clouds);
  cloudList.forEach((cloud) => sky.removeChild(cloud));
  // adding new clouds
  for (let i = 1; i <= count; i++) {
    if (index > 5) {
      index = 1;
    }
    let newCloud = document.createElement("div");
    newCloud.classList.add(`fg`, `cloud`, `x${index}`);
    let y = cloudY();
    let V = variationCoeff(80);
    const ANIMATION_LENGTH = BASE_TIME + y * 1.5;
    newCloud.style.cssText = `margin-top: ${y}%;
    animation: animateCloud ${ANIMATION_LENGTH}s linear infinite;
    opacity: ${V * 100 * (0.9 + 0.1 / +y)}%;
    transform: scale(${BASE_SCALE - y / 100});
    animation-delay: -${getRandomInt(0, ANIMATION_LENGTH)}s;
    z-index: 2;`;
    y > 20
      ? (newCloud.style.backgroundPosition = "top left")
      : (newCloud.style.backgroundPosition = "top right");
    sky.prepend(newCloud);
    index++;
  }
  const cloudCount = document.querySelectorAll(".fg.cloud").length;
  console.log("clouds: ", cloudCount);
}
cloudGenerator(30);

// Moon pop up :)

function dropdown(child) {
  child[0].classList.toggle("model-open");
}

// function to remove given filters
const removeFilter = (filt) => {
  const filters = document.documentElement.style.filter.toString().split(" ");
  return filters.filter((item) => !item.includes(filt));
};

function invert(x) {
  // document.documentElement.classList.toggle("invert");
  const newFilters = removeFilter("invert");
  newFilters.push(`invert(${x}%) `);
  document.documentElement.style.filter = newFilters.join(" ");
}
function sepia(x) {
  const newFilters = removeFilter("sepia");
  newFilters.push(`sepia(${x / 100}) `);
  document.documentElement.style.filter = newFilters.join(" ");
}
function hueRotate(x) {
  const newFilters = removeFilter("hue-rotate");
  newFilters.push(`hue-rotate(${x}deg) `);
  document.documentElement.style.filter = newFilters.join(" ");
}

// moon 5 second thing
const noti = document.querySelector("#hideDiv");

setTimeout(() => {
  noti.style.display = "none";
}, 10000);
const closeDiv = () => (noti.style.display = "none");
