const canvas = document.getElementById("cw");
const context = canvas.getContext("2d");

const earth = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

let planetsArray = [];

let sunTheta = 0.0;
const au = 80;
const moonRadius = au / Math.pow(144, 1 / 3);
const speedConst = 4;
const trailWidth = 2;
// Sun
let planetSun = new PlanetSunOrMoon(au, 0.0, speedConst / Math.pow(au, 1.5));
let clearCanvasFlag = 0;
// Mercury
planetsArray[0] = new Planet(au * 0.387, Math.random() * Math.PI * 2);

// Venus
planetsArray[1] = new Planet(au * 0.723, Math.random() * Math.PI * 2);

// Mars
planetsArray[2] = new Planet(au * 1.524, Math.random() * Math.PI * 2);

// Jupiter
planetsArray[3] = new Planet(au * 2.767, Math.random() * Math.PI * 2);

// Saturn
planetsArray[4] = new Planet(au * 5.204, Math.random() * Math.PI * 2);

// Moon
planetsArray[5] = new PlanetSunOrMoon(
  au * 0.183,
  0.0,
  (speedConst / Math.pow(au, 1.5)) * 12
);
setSize();
anim();
addEventListener("resize", () => setSize());

function setSize() {
  clearCanvasFlag = 2;

  canvas.height = innerHeight;
  canvas.width = innerWidth;
  earth.x = innerWidth / 2;
  earth.y = innerHeight / 2;
}

function Planet(r, theta, color = "black") {
  this.theta = theta;
  this.r = r;
  this.x = earth.x + Math.cos(theta) * r - Math.cos(sunTheta) * au;
  this.y = earth.y + Math.sin(theta) * r - Math.sin(sunTheta) * au;
  this.rotateSpeed = speedConst / Math.pow(this.r, 1.5);

  this.rotate = () => {
    const ls = {
      x: this.x,
      y: this.y,
    };
    this.theta += this.rotateSpeed;

    this.x = earth.x + Math.cos(this.theta) * this.r - Math.cos(sunTheta) * au;
    this.y = earth.y + Math.sin(this.theta) * this.r - Math.sin(sunTheta) * au;
    context.beginPath();
    context.lineWidth = trailWidth;
    context.strokeStyle = color;
    context.moveTo(ls.x, ls.y);
    context.lineTo(this.x, this.y);
    context.stroke();
  };
}

function PlanetSunOrMoon(r, theta, rotateSpeed, color = "yellow") {
  this.theta = theta;
  this.r = r;
  this.x = earth.x - Math.cos(theta) * r;
  this.y = earth.y - Math.sin(theta) * r;
  this.rotateSpeed = rotateSpeed;

  this.rotate = () => {
    const ls = {
      x: this.x,
      y: this.y,
    };
    this.theta += this.rotateSpeed;

    this.x = earth.x - Math.cos(this.theta) * this.r;
    this.y = earth.y - Math.sin(this.theta) * this.r;
    context.beginPath();
    context.lineWidth = trailWidth;
    context.strokeStyle = color;
    context.moveTo(ls.x, ls.y);
    context.lineTo(this.x, this.y);
    context.stroke();
  };
}

function anim() {
  requestAnimationFrame(anim);

  context.fillStyle = "rgba(255,255,255,0.01)";
  if (clearCanvasFlag > 0) {
    context.fillStyle = "rgba(255,255,255,1)";
    clearCanvasFlag--;
  }
  context.fillRect(0, 0, canvas.width, canvas.height);
  planetSun.rotate();
  sunTheta = planetSun.theta;
  planetsArray.forEach((planet) => planet.rotate());
}
