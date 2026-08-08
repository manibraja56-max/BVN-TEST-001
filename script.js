/* =====================================
   BVN SMART ENGINE V1
   ENG-003.6
   Touch / Drag Rotation
   Includes ENG-003.5 Camera Follow
===================================== */

const scene = document.querySelector(".scene");


/* =====================================
   CAMERA
===================================== */

const camera = {

    x: 0,
    y: 0,

    targetX: 0,
    targetY: 0,

    smooth: 0.08

};


/* =====================================
   PLANET SELECTION
===================================== */

let selectedPlanet = null;


/* =====================================
   TOUCH / DRAG ROTATION
===================================== */

let isDragging = false;

let lastX = 0;
let lastY = 0;

let userRotationX = 0;
let userRotationY = 0;


/* Prevent browser scrolling while dragging scene */

scene.style.touchAction = "none";


/* Pointer Down */

scene.addEventListener("pointerdown", (e) => {

    isDragging = true;

    lastX = e.clientX;
    lastY = e.clientY;

    scene.setPointerCapture(e.pointerId);

});


/* Pointer Move */

scene.addEventListener("pointermove", (e) => {

    if (!isDragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    userRotationY += dx * 0.35;

    userRotationX -= dy * 0.15;

    lastX = e.clientX;
    lastY = e.clientY;

});


/* Pointer Up */

scene.addEventListener("pointerup", (e) => {

    isDragging = false;

    scene.releasePointerCapture(e.pointerId);

});


/* Pointer Cancel */

scene.addEventListener("pointercancel", () => {

    isDragging = false;

});


/* =====================================
   ORBIT DATA
===================================== */

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
   CREATE ORBITS
===================================== */

orbitData.forEach((data, index) => {

    const orbit = document.createElement("div");

    orbit.className = "orbit";


    /* Orbit Size */

    orbit.style.width = data.radius + "px";

    orbit.style.height = data.radius + "px";


    /* Planet */

    const planet = document.createElement("div");

    planet.className = "planet";


    planet.style.width =
        data.planetSize + "px";

    planet.style.height =
        data.planetSize + "px";

    planet.style.background =
        data.color;


    /* Add Planet to Orbit */

    orbit.appendChild(planet);

    scene.appendChild(orbit);


    /* Orbit Object */

    const obj = {

        orbit,

        planet,

        radius: data.radius,

        planetSize: data.planetSize,

        angle: data.angle,

        speed: data.speed

    };


    /* =================================
       PLANET SELECTION
    ================================= */

    planet.addEventListener("click", () => {

        document
            .querySelectorAll(".planet")
            .forEach(p => {

                p.classList.remove("selected");

            });


        planet.classList.add("selected");


        selectedPlanet = obj;

    });


    /* Store Orbit */

    orbits.push(obj);

});


/* =====================================
   ANIMATE
===================================== */

function animate() {


    /* =================================
       ORBIT MOTION
    ================================= */

    orbits.forEach(obj => {


        /* Automatic orbit */

        obj.angle += obj.speed;


        /* Rotate orbit */

        obj.orbit.style.transform =
            `translate(-50%, -50%)
             rotate(${obj.angle}deg)`;


        /* Planet Position */

        obj.planet.style.left =
            (obj.radius / 2)
            - (obj.planetSize / 2)
            + "px";


        obj.planet.style.top =
            (-obj.planetSize / 2)
            + "px";

    });


    /* =================================
       CAMERA FOLLOW
    ================================= */

    if (selectedPlanet) {


        const rad =
            selectedPlanet.angle
            * Math.PI
            / 180;


        const distance =
            selectedPlanet.radius / 2;


        const x =
            Math.sin(rad)
            * distance;


        const y =
            -Math.cos(rad)
            * distance;


        camera.targetX = -x;

        camera.targetY = -y;

    }

    else {


        camera.targetX = 0;

        camera.targetY = 0;

    }


    /* =================================
       CAMERA SMOOTHING
    ================================= */

    camera.x +=
        (camera.targetX - camera.x)
        * camera.smooth;


    camera.y +=
        (camera.targetY - camera.y)
        * camera.smooth;


    /* =================================
       FINAL SCENE TRANSFORM
       Camera + Touch Rotation
    ================================= */

    scene.style.transform =

        `translate(
            calc(-50% + ${camera.x}px),
            calc(-50% + ${camera.y}px)
        )
        rotateX(${userRotationX}deg)
        rotateY(${userRotationY}deg)`;


    /* Next Frame */

    requestAnimationFrame(animate);

}


/* =====================================
   START ENGINE
===================================== */

animate();
