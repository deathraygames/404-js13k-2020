// import Loop from '../node_modules/rocket-boots-loop/src/Loop.js';
import Ship from './Ship.js';
import SpaceObject from './SpaceObject.js';
import Asteroid from './Asteroid.js';

// import webglp from '../node_modules/webglp/webglp.js';

import webglp from '../../../rocket-boots-repos/webglp/webglp.js';

const SHADERS = [
	['stars-v.glsl', 'stars-f.glsl'],
	['v.glsl', 'f.glsl'],
];
const NUM_OF_ASTEROIDS = 404;
const SUN_MASS_MULTIPLIER = 10000;
const ASTEROID_RADIUS = 120;
const ASTEROID_RADIUS_RANGE = 30;

const MAX_ZOOM_DELTA = 600;
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 5000;
const ZOOM_MULTIPLIER = .001;

let zoom = 12.;
let glp;
let lastAsteroidCount = NUM_OF_ASTEROIDS;
let loop;
let isStarted = false;

const objects = [];
const sun = setupSun();
const asteroids = setupAsteroids(sun);
const ship = setupShip(sun)

const $ = (id) => document.getElementById(id);

const draw = () => {
	const uniforms = [
		['iResolution', glp.gl.canvas.width, glp.gl.canvas.height],
		['zoom', zoom],
		['viewerPosition', ship.pos.x, ship.pos.y, 0.],
		// ['color', 1., 1., 0., 1.],
	];

	// Draw stars background
	glp.use(0).draw({ uniforms, buffs: [['position']] });

	// Draw galaxy
	const buffs = [
		['position', { size: 3, stride: 6 }],
		['color', { size: 3, stride: 6, offset: 3 }],
	];
	glp.use(1).draw({
		uniforms,
		buffs,
		verts: new Float32Array([]), 
		vertSize: 6,
		type: glp.gl.TRIANGLE_FAN,
		clear: false,
		// buffName: 'position',
		// verts: vertices,
	});

	objects.forEach((o) => {
		// glp.unif('translation', 0, 0, 0); // o.x, o.y, o.z);
		glp.draw({
			// uniforms: [],
			buffs,
			verts: o.getVertColors(), // used to calculate the verts to draw
			vertSize: 6,
			type: glp.gl.TRIANGLE_FAN,
			clear: false,
			// buffName: 'position',
			// verts: vertices,
		});
	});
};

const removeDeletedObjects = (deleteIndices = []) => {
	for(let d = deleteIndices.length - 1; d >= 0; d--) {
		const i = deleteIndices[d];
		objects.splice(i, 1);
	}
};

const objectLoop = (t) => {
	let asteroidCount = 0;
	const deleteIndices = [];
	objects.forEach((o, i) => {
		if (o.delete) {
			deleteIndices.push(i);
			return;
		}
		if (o.ongoing) { o.ongoing(t); }
		o.rotate(t);
		o.calcVertsWithRotation();
		// if (o.gravitate) { o.gravitate(t, objects); }
		if (o.gravitate) { o.gravitate(t, [objects[0]]); }
		o.move(t);
		o.collide(objects);
		o.clearHit();
		o.checkHits(objects);
		if (o instanceof Asteroid) {
			asteroidCount++;
		}
	});
	removeDeletedObjects(deleteIndices);
	return { asteroidCount };
};

function makeDecay(o, n = 8) {
	o.decayTime = n;
	o.ongoing = (t) => {
		o.decayTime -= t;
		if (o.decayTime < 0) { o.delete = true; }
	};
}

const makeBullet = (ship, bulletPower) => {
	const baseVerts = [
		[0, .2, 0],
		[-.1, -.1, 0],
		[0, -.2, 0],
		[.1, -.1, 0],
	];
	const b = new SpaceObject(baseVerts);
	b.rotation = ship.rotation;
	const facing = ship.getFacingUnitVector().multiply(-1);
	b.pos.set(ship.pos).add(facing.getMultiply(ship.shipScale));
	b.vel.set(ship.vel).add(facing.getMultiply(bulletPower));
	b.mass *= 0.5;
	makeDecay(b, 8);
	b.damage = (dmg, objHit) => {
		// console.log(dmg / 10);
		b.decayTime *= 0.5;
		if (objHit !== sun) {
			objHit.delete = true;
		}
	};
	b.gravitate = null; // Don't apply gravity to bullets
	objects.push(b);
};

function setupShip(sun) {
	const ship = new Ship();
	ship.pos.set({ x: ASTEROID_RADIUS, y: 0 });
	ship.baseColor = [0.6, 1., .3];
	ship.setOrbitalVelocity(sun);
	// console.log(ship);
	objects.push(ship);
	return ship;
}

function putInRandomOrbit(o, sun) {
	const r = ASTEROID_RADIUS + Math.random() * ASTEROID_RADIUS_RANGE;
	const theta = Math.PI * 2 * Math.random();
	o.pos.setByPolarCoords(r, theta);
	o.setOrbitalVelocity(sun);
	o.rotVel = Math.random() * .3 - Math.random() * .3;
}

function setupAsteroids(sun) {
	// const baseVerts = [
	// 	[0, .4, 0],
	// 	[-.2, -.2, 0],
	// 	[.2, -.2, 0],
	// ];
	// let o = new SpaceObject(baseVerts);
	// o.pos.set({ x: 0, y: 0 });
	// o.vel.set({ x: 0, y: 0.1 });
	// objects.push(o);

	// const randVert = () => Math.round((Math.random() * 4 - 2) * 1000)/1000;

	for(let i = 0; i < NUM_OF_ASTEROIDS; i++) {
		// const baseVerts = [];
		// for(let v = 0; v < 3; v++) {
		// 	baseVerts.push([randVert(), randVert(), 0]);
		// }
		// const baseVerts = SpaceObject.getRegularPolygonVerts(randomVertNum(), randomRadius());
		const o = new Asteroid();
		putInRandomOrbit(o, sun);
		o.damage = (dmg, objHit) => {
			if (objHit === sun) {
				putInRandomOrbit(o, sun);
			}
		};
		objects.push(o);
	}
};

function setupSun() {
	const baseVerts = SpaceObject.getRegularPolygonVerts(40, 40);
	// [
	// 	[0, 40, 0],
	// 	[30, 30, 0],
	// 	[40, 0, 0],
	// 	[30, -30, 0],
	// 	[0, -40, 0],
	// 	[-30, -30, 0],
	// 	[-40, 0, 0],
	// 	[-30, 30, 0],
	// ];
	const sun = new SpaceObject(baseVerts);
	sun.pos.set({ x: 0, y: 0 });
	sun.move = () => {}; // override the move function so that sun never moves
	sun.mass *= SUN_MASS_MULTIPLIER;
	objects.push(sun);
	return sun;
}

const setupLoop = (ship, countElt) => {
	let t = 0;
	const drawDom = (c) => {
		if (lastAsteroidCount === c) { return; }
		countElt.innerHTML = c;
		lastAsteroidCount = c;
		if (c === 0) {
			$('win').style.display = 'block';
		}
	}
	loop = () => {
		window.requestAnimationFrame((now) => {
			const { asteroidCount } = objectLoop((now - t) / 1000);
			drawDom(asteroidCount);
			draw();
			t = now;
			loop();
		});
	};
	objectLoop(0);
	draw();
	// objectLoop(0.1 / 1000);
	// draw();
};

function startLoop() {
	if (isStarted) { return; }
	isStarted = true;
	$('main').classList.add('go');
	loop();
}

const getMousePosition = (e) => {
	// fix for Chrome
	const eFixed = (e.type.startsWith('touch')) ? e.targetTouches[0] : e;
	return [eFixed.pageX, eFixed.pageY];
}

const setupInput = (canvas, ship) => {
	const canvasSize = [canvas.width, canvas.height];
	window.addEventListener('wheel', (e) => {
		// control speed based on current zoom, throttle the speed
		const zoomSpeed = Math.min(MAX_ZOOM_DELTA, Math.abs(e.deltaY)) * ZOOM_MULTIPLIER * zoom;
		const zoomDir = (e.deltaY < 0 ? -1 : 1);
		// cap the zoom
		zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + zoomDir * zoomSpeed));
		// console.log(zoom);
		if (!isStarted) { draw(); }
	});
	window.oncontextmenu = (e) => e.preventDefault();
	canvas.onmousedown = canvas.ontouchstart = (e) => {
		if (e.which === 3) { ship.engage(); }
	};
	canvas.onmouseup = canvas.ontouchend = (e) => {
		startLoop();
		if (e.which === 3) {
			ship.disengage();
			return;
		}
		const bulletPower = ship.fire();
		makeBullet(ship, bulletPower);
	};
	canvas.onmousemove = canvas.ontouchmove = (e) => {
		const fixedCurrentMousePos = getMousePosition(e).map((n, i) => (
			(n - (canvasSize[i] / 2)) * (i === 1 ? -1 : 1)
		));
		const theta = Math.atan2(fixedCurrentMousePos[1], fixedCurrentMousePos[0]);
		ship.rotation = theta - Math.PI/2;
		// console.log(fixedCurrentMousePos, theta, theta * (Math.PI * 2));
	};
};

// Create glp
const init = async () => {
	glp = await webglp.init('#canvas', SHADERS, { fullscreen: true });
	window.z.glp = glp;
	console.log(glp);
	setupInput(glp.gl.canvas, ship, sun);
	setupLoop(ship, $('count'));
	return glp;
}

document.addEventListener('DOMContentLoaded', init);

window.z = { SpaceObject, glp, objects };
