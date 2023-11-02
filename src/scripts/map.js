import { WIDTH, HEIGHT } from './constants.js';
import { Boundary } from './classes.js';
import { Fruit, PowerUp } from './classes.js';

const boundaries = [];
const fruits = [];
const powerUps = [];

const map = [
	['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
	['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
	['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
	['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
	['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
	['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
	['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
	['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
	['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
	['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
	['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
	['|', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
	['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'],
];

function createWall(posX, posY, img) {
	boundaries.push(
		new Boundary({
			position: {
				x: WIDTH * posX,
				y: HEIGHT * posY,
			},
			image: `./images/${img}`,
		}),
	);
}

for (let posY in map) {
	for (let posX in map[posY]) {
		switch (map[posY][posX]) {
			case '-':
				createWall(posX, posY, 'pipeHorizontal.png');
				break;
			case '|':
				createWall(posX, posY, 'pipeVertical.png');
				break;
			case '1':
				createWall(posX, posY, 'pipeCorner1.png');
				break;
			case '2':
				createWall(posX, posY, 'pipeCorner2.png');
				break;
			case '3':
				createWall(posX, posY, 'pipeCorner3.png');
				break;
			case '4':
				createWall(posX, posY, 'pipeCorner4.png');
				break;
			case 'b':
				createWall(posX, posY, 'block.png');
				break;
			case '[':
				createWall(posX, posY, 'capLeft.png');
				break;
			case ']':
				createWall(posX, posY, 'capRight.png');
				break;
			case '_':
				createWall(posX, posY, 'capBottom.png');
				break;
			case '^':
				createWall(posX, posY, 'capTop.png');
				break;
			case '+':
				createWall(posX, posY, 'pipeCross.png');
				break;
			case '5':
				createWall(posX, posY, 'pipeConnectorTop.png');
				break;
			case '6':
				createWall(posX, posY, 'pipeConnectorRight.png');
				break;
			case '7':
				createWall(posX, posY, 'pipeConnectorBottom.png');
				break;
			case '8':
				createWall(posX, posY, 'pipeConnectorLeft.png');
				break;
			case '.':
				fruits.push(
					new Fruit({
						position: {
							x: posX * WIDTH + WIDTH / 2,
							y: posY * HEIGHT + HEIGHT / 2,
						},
					}),
				);
				break;
			case 'p':
				powerUps.push(
					new PowerUp({
						position: {
							x: posX * WIDTH + WIDTH / 2,
							y: posY * HEIGHT + HEIGHT / 2,
						},
					}),
				);
				break;
		}
	}
}

export { boundaries, fruits, powerUps };
