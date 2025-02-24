function changecolor(skr) {
  skr.style.backgroundColor = "violet";
  skr.style.boxShadow = "0px 0px 7px mediumorchid";
}

const projectPhotos = document.querySelectorAll(".project-photo");

function darkSideOfTheMoon() {
  document.documentElement.style.filter =
    document.documentElement.style.filter.includes("contrast")
      ? "invert(00%)"
      : "invert(100%) saturate(105%) contrast(110%) brightness(0.9)";

  // EXCLUDE specific elements from inversion
  setTimeout(() => {
    document.querySelectorAll(".no-invert").forEach((element) => {
      element.style.filter = element.style.filter.includes("100%")
        ? "invert(0%)"
        : "invert(100%)";
    });
  }, 5);

  me.style.filter = me.style.filter.includes("100%")
    ? "invert(0%)"
    : "invert(100%)";
  projectPhotos.forEach(
    (photo) =>
      (photo.style.filter = photo.style.filter.includes("100%")
        ? "invert(0%)"
        : "invert(100%)")
  );
  moonBg.style.filter = me.style.filter.includes("100%")
    ? "brightness(9) opacity(1)"
    : "";
  moonBg.style.opacity = me.style.filter.includes("100%") ? "1" : "0.05";
  window.style.backgroundColor = me.style.filter.includes("100%")
    ? "black"
    : "white";

  console.log(w, me);
}

// moon 5 second thing
const noti = document.querySelector("#hideDiv");

setTimeout(() => {
  noti.style.display = "none";
}, 10000);
const closeDiv = () => (noti.style.display = "none");

/* MOUSE TRACKING FUNCTION */
window.onload = function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  //Make the canvas occupy the full page
  var W = window.innerWidth,
    H = window.innerHeight;
  const Xcoeff = W <= 1920 ? 1 : W <= 2560 ? 3 / 4 : 0.5;
  canvas.width = W * Xcoeff;
  canvas.height = 400 * Xcoeff;

  var particles = [];
  var mouse = {};

  //Lets create some particles now
  var particle_count = 50;
  for (var i = 0; i < particle_count; i++) {
    particles.push(new particle());
  }

  //finally some mouse tracking
  canvas.addEventListener("mousemove", track_mouse, false);

  function track_mouse(e) {
    //since the canvas = full page the position of the mouse
    //relative to the document will suffice
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  }

  function particle() {
    //speed, life, location, life, colors
    //speed.x range = -2.5 to 2.5
    //speed.y range = -15 to -5 to make it move upwards
    //lets change the Y speed to make it look like a flame
    this.speed = { x: -2.5 + Math.random() * 5, y: 15 - Math.random() * 10 };
    //location = mouse coordinates
    //Now the flame follows the mouse coordinates
    if (mouse.x && mouse.y) {
      this.location = { x: mouse.x * Xcoeff - 25, y: mouse.y * Xcoeff + 40 };
    } else {
      this.location = { x: W / 2, y: H / 2 };
    }
    //radius range = 10-30
    this.radius = Math.random() * 20;
    //life range = 20-30
    this.life = 20 + Math.random() * 10;
    this.remaining_life = this.life;
    //colors
    this.r = Math.round(Math.random() * 255);
    this.g = Math.round(Math.random() * 255);
    this.b = Math.round(Math.random() * 255);
  }

  function draw() {
    //Painting the canvas black
    //Time for lighting magic
    //particles are painted with "lighter"
    //In the next frame the background is painted normally without blending to the
    //previous frame
    ctx.globalCompositeOperation = "source-over";

    var img = new Image();

    img.src = "./spaceimage.png";

    var pattern = ctx.createPattern(img, "no-repeat");
    ctx.fillStyle = pattern;

    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = "lighter";

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      //changing opacity according to the life.
      //opacity goes to 0 at the end of life of a particle
      p.opacity = Math.round((p.remaining_life / p.life) * 100) / 100;
      //a gradient instead of white fill
      var gradient = ctx.createRadialGradient(
        p.location.x,
        p.location.y,
        0,
        p.location.x,
        p.location.y,
        p.radius
      );
      gradient.addColorStop(
        0,
        "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")"
      );
      gradient.addColorStop(
        0.5,
        "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")"
      );
      gradient.addColorStop(
        1,
        "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)"
      );
      ctx.fillStyle = gradient;
      ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
      ctx.fill();

      //lets move the particles
      p.remaining_life--;
      p.radius--;
      p.location.x += p.speed.x;
      p.location.y += p.speed.y;

      //regenerate particles
      if (p.remaining_life < 0 || p.radius < 0) {
        //a brand new particle replacing the dead one
        particles[i] = new particle();
      }
    }
  }

  setInterval(draw, 30);
};

// scaling me :D
const userCircle = document.querySelector(".user-circle");
const W = window.innerWidth;
userCircle.style.transform = `scale(${
  (W * 1.15) / 1920 > 0.9 ? (W * 1.15) / 1920 : 0.9
})`;
console.log(userCircle, W);
