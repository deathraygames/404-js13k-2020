import SpaceObject from './SpaceObject.js';

const randomVertNum = () => 3 + Math.floor(Math.random() * 7);
const randomRadius = () => 1.5 + Math.random() * .5 - Math.random() * .5;

class Asteroid extends SpaceObject {
	constructor() {
		const baseVerts = SpaceObject.getRegularPolygonVerts(randomVertNum(), randomRadius());
		super(baseVerts);
	}
}

export default Asteroid;
