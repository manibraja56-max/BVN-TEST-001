/* =====================================
   BVN SMART ENGINE V1
   ENG-003.7
   Z-Axis / Depth
   Includes ENG-003.6 Touch / Drag Rotation
   Includes ENG-003.5 Camera Follow
===================================== */

const scene = document.querySelector(".scene");


/* =====================================
   3D SPACE
===================================== */

scene.style.touchAction = "none";
scene.style.transformStyle = "preserve-3d";

if (scene.parentElement) {
    scene.parentElement.style.perspective = "900px";
    scene.parentElement.style.transformStyle = "preserve-3d";
}


/* =====================================
   CAMERA
===================================== */

const camera = {

    x: 0,
    y: 0,

    targetX: 0,
    targetY: 0,

    depth: 0,
    targetDepth: 0,

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


/* =====================================
   Z-AXIS DEPTH
===================================== */

let userDepth = 0;

const MIN_DEPTH = -350;
const MAX_DEPTH = 350;


/* =====================================
   POINTER TRACKING
===================================== */

const activePointers = new Map();

let pinchStartDistance = null;
let pinchStartDepth = 0;


/* =====================================
   POINTER DOWN
===================================== */

scene.addEventListener("pointerdown", (e) => {

    activePointers.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY
    });

    scene.setPointerCapture(e.pointerId);


    /* Single finger / mouse */

    if (activePointers.size === 1) {

        isDragging = true;

        lastX = e.clientX;
        lastY = e.clientY;

    }


    /* Two finger pinch */

    if (activePointers.size === 2) {

        isDragging = false;

        const points = [...activePointers.values()];

        const dx = points[0].x - points[1].x;
        const dy = points[0].y - points[1].y;

        pinchStartDistance =
            Math.sqrt(dx * dx + dy * dy);

        pinchStartDepth = userDepth;
    }

});


/* =====================================
   POINTER MOVE
===================================== */

scene.addEventListener("pointermove", (e) => {

    if (!activePointers.has(e.pointerId)) {
        return;
    }


    activePointers.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY
    });


    /* =================================
       TWO FINGER DEPTH CONTROL
    ================================= */

    if (activePointers.size === 2) {

        const points = [...activePointers.values()];

        const dx =
            points[0].x - points[1].x;

        const dy =
            points[0].y - points[1].y;

        const currentDistance =
            Math.sqrt(dx * dx + dy * dy);


        if (pinchStartDistance !== null) {

            const difference =
                currentDistance - pinchStartDistance;

            userDepth =
                pinchStartDepth + difference * 1.2;

            userDepth =
                Math.max(
                    MIN_DEPTH,
                    Math.min(MAX_DEPTH, userDepth)
                );
        }

        return;
    }


    /* =================================
       SINGLE FINGER ROTATION
    ================================= */

    if (!isDragging) {
        return;
    }

    const dx =
        e.clientX - lastX;

    const dy =
        e.clientY - lastY;


    userRotationY +=
        dx * 0.35;

    userRotationX -=
        dy * 0.15;


    lastX = e.clientX;
    lastY = e.clientY;

});


/* =====================================
   POINTER UP
===================================== */

scene.addEventListener("pointerup", (e) => {

    activePointers.delete(e.pointerId);

    isDragging = false;

    pinchStartDistance = null;

});


/* =====================================
   POINTER CANCEL
===================================== */

scene.addEventListener("pointercancel", (e) => {

    activePointers.delete(e.pointerId);

    isDragging = false;

    pinchStartDistance = null;

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
        angle: 0,
        depth: 0
    },

    {
        radius: 300,
        planetSize: 45,
        color: "#f59e0b",
        speed: -0.8,
        angle: 180,
        depth: 0
    }

];


const orbits = [];


/* =====================================
   CREATE ORBITS
===================================== */

orbitData.forEach((data) => {

    const orbit =
        document.createElement("div");

    orbit.className = "orbit";


    /* Orbit Size */

    orbit.style.width =
        data.radius + "px";

    orbit.style.height =
        data.radius + "px";

    orbit.style.transformStyle =
        "preserve-3d";


    /* =================================
       PLANET
    ================================= */

    const planet =
        document.createElement("div");

    planet.className = "planet";


    planet.style.width =
        data.planetSize + "px";

    planet.style.height =
        data.planetSize + "px";

    planet.style.background =
        data.color;

    planet.style.transformStyle =
        "preserve-3d";


    /* Add Planet */

    orbit.appendChild(planet);

    scene.appendChild(orbit);


    /* =================================
       ORBIT OBJECT
    ================================= */

    const obj = {

        orbit,
        planet,

        radius:
            data.radius,

        planetSize:
            data.planetSize,

        angle:
            data.angle,

        speed:
            data.speed,

        depth:
            data.depth
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

        obj.angle += obj.speed;


        /* Orbit rotation */

        obj.orbit.style.transform =
            `translate(-50%, -50%)
             rotate(${obj.angle}deg)`;


        /* Planet position */

        obj.planet.style.left =
            (obj.radius / 2)
            - (obj.planetSize / 2)
            + "px";

        obj.planet.style.top =
            (-obj.planetSize / 2)
            + "px";


        /* =================================
           PLANET Z-AXIS
        ================================= */

        obj.planet.style.transform =
            `translateZ(${obj.depth}px)`;

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


        camera.targetX =
            -x;

        camera.targetY =
            -y;

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
       DEPTH SMOOTHING
    ================================= */

    camera.targetDepth =
        userDepth;

    camera.depth +=
        (camera.targetDepth - camera.depth)
        * 0.12;


    /* =================================
       FINAL 3D TRANSFORM
    ================================= */

    scene.style.transform =

        `translate3d(
            calc(-50% + ${camera.x}px),
            calc(-50% + ${camera.y}px),
            ${camera.depth}px
        )
        rotateX(${userRotationX}deg)
        rotateY(${userRotationY}deg)`;


    /* =================================
       NEXT FRAME
    ================================= */

    requestAnimationFrame(animate);

}


/* =====================================
   START ENGINE
===================================== */

animate();
