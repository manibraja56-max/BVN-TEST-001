/* =====================================
   BVN SMART ENGINE V1
   ENG-003.3
   Camera Follow Engine
===================================== */

const scene = document.querySelector(".scene");

const camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    smooth: 0.08
};

let selectedPlanet = null;

const orbitData = [

    {
        radius: 450,
        planetSize: 60,
        color: "#3b82f6",
        speed: 0.4,
        angle: 0
    },

    {
        radius: 300,
        planetSize: 45,
        color: "#f59e0b",
        speed: -0.8,
        angle: 180
    }

];

const orbits = [];

/* =====================================
   Create Orbits
===================================== */

orbitData.forEach((data, index) => {

    const orbit = document.createElement("div");
    orbit.className = "orbit";

    orbit.style.width = data.radius + "px";
    orbit.style.height = data.radius + "px";

    const planet = document.createElement("div");
    planet.className = "planet";

    planet.style.width = data.planetSize + "px";
    planet.style.height = data.planetSize + "px";
    planet.style.background = data.color;

    orbit.appendChild(planet);
    scene.appendChild(orbit);

    const obj = {

        orbit,
        planet,

        radius: data.radius,
        planetSize: data.planetSize,

        angle: data.angle,
        speed: data.speed

    };

    planet.addEventListener("click", () => {

        document.querySelectorAll(".planet").forEach(p => {

            p.classList.remove("selected");

        });

        planet.classList.add("selected");

        selectedPlanet = obj;

    });

    orbits.push(obj);

});

/* =====================================
   Animate
===================================== */

function animate() {

    orbits.forEach(obj => {

        obj.angle += obj.speed;

        obj.orbit.style.transform =
            `translate(-50%, -50%) rotate(${obj.angle}deg)`;

        obj.planet.style.left =
            (obj.radius / 2) - (obj.planetSize / 2) + "px";

        obj.planet.style.top =
            (-obj.planetSize / 2) + "px";

    });

    /* ==========================
       Camera Follow
    ========================== */

    if (selectedPlanet) {

        const rad = selectedPlanet.angle * Math.PI / 180;

        const distance = selectedPlanet.radius / 2;

        const x = Math.sin(rad) * distance;
        const y = -Math.cos(rad) * distance;

        camera.targetX = -x;
        camera.targetY = -y;

    }
    else {

        camera.targetX = 0;
        camera.targetY = 0;

    }

    camera.x += (camera.targetX - camera.x) * camera.smooth;
    camera.y += (camera.targetY - camera.y) * camera.smooth;

    scene.style.transform =
        `translate(calc(-50% + ${camera.x}px), calc(-50% + ${camera.y}px))`;

    requestAnimationFrame(animate);

}

animate();