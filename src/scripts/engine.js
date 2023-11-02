import { Boundary, Player, Ghost } from './classes.js';
import { ctx, WIDTH, HEIGHT, SPEED } from './constants.js';
import { boundaries, fruits, powerUps } from './map.js';

const scoreNumber = document.querySelector('.scoreNumber');
const timeNumber = document.querySelector('.timeNumber');
const btn_up = document.querySelector('.btn_up');
const btn_left = document.querySelector('.btn_left');
const btn_down = document.querySelector('.btn_down');
const btn_right = document.querySelector('.btn_right');
const info = document.querySelector('.info');
const lose = document.querySelector('.lose');
const win = document.querySelector('.win');
const timer = document.querySelector('.timer');
const game = document.querySelector('.game');
const btnStart = document.querySelector('.btnStart');

const keys = {
	w: {
		pressed: false,
	},
	a: {
		pressed: false,
	},
	s: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	btn_up: {
		pressed: false,
	},
	btn_left: {
		pressed: false,
	},
	btn_down: {
		pressed: false,
	},
	btn_right: {
		pressed: false,
	},
};

let lastKey = '';
let score = 0;
let gameAudio;
let startTime = 0;
let intervalID = null;
let animationId;

const createGhost = (color) => {
	return new Ghost({
		position: {
			x: WIDTH * 8 + WIDTH / 2,
			y: HEIGHT * 11 + HEIGHT / 2,
		},
		velocity: {
			x: SPEED,
			y: 0,
		},
		color,
	});
};

const ghosts = [createGhost('#f00'), createGhost('#ffa500')];

const player = new Player({
	position: {
		x: WIDTH + WIDTH / 2,
		y: HEIGHT + HEIGHT / 2,
	},
	velocity: {
		x: 0,
		y: 0,
	},
});

function playAudio(music, volume) {
	const audio = new Audio(`./sounds/${music}.mp3`);
	audio.volume = volume;

	try {
		audio.play();
	} catch {}
	return audio;
}

function updateTime() {
	const elapsedTime = Date.now() - startTime;
	const secs = Math.floor((elapsedTime / 1000) % 60);
	const mins = Math.floor((elapsedTime / (1000 * 60)) % 60);

	const formattedSecs = secs.toString().padStart(2, '0');
	const formattedMins = mins.toString().padStart(2, '0');

	timeNumber.textContent = `${formattedMins}:${formattedSecs}`;
}

function youLose() {
	game.style.display = 'none';
	lose.style.display = 'block';
}

function youWin() {
	game.style.display = 'none';
	win.style.display = 'block';
	timer.innerHTML = timeNumber.textContent;
}

function collides({ circle, rectangle }) {
	const padding = Boundary.width / 2 - circle.radius - 1;

	return (
		circle.position.y - circle.radius + circle.velocity.y <=
			rectangle.position.y + rectangle.height + padding &&
		circle.position.x + circle.radius + circle.velocity.x >=
			rectangle.position.x - padding &&
		circle.position.y + circle.radius + circle.velocity.y >=
			rectangle.position.y - padding &&
		circle.position.x - circle.radius + circle.velocity.x <=
			rectangle.position.x + rectangle.width + padding
	);
}

function animate() {
	animationId = requestAnimationFrame(animate);
	ctx.clearRect(0, 0, 420, 720);

	if (
		(keys.w.pressed && lastKey === 'w') ||
		(keys.btn_up.pressed && lastKey === 'btn_up')
	) {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				collides({
					circle: {
						...player,
						velocity: {
							x: 0,
							y: -4,
						},
					},
					rectangle: boundary,
				})
			) {
				player.velocity.y = 0;
				break;
			} else {
				player.velocity.y = -4;
			}
		}
	} else if (
		(keys.a.pressed && lastKey === 'a') ||
		(keys.btn_left.pressed && lastKey === 'btn_left')
	) {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				collides({
					circle: {
						...player,
						velocity: {
							x: -4,
							y: 0,
						},
					},
					rectangle: boundary,
				})
			) {
				player.velocity.x = 0;
				break;
			} else {
				player.velocity.x = -4;
			}
		}
	} else if (
		(keys.s.pressed && lastKey === 's') ||
		(keys.btn_down.pressed && lastKey === 'btn_down')
	) {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				collides({
					circle: {
						...player,
						velocity: {
							x: 0,
							y: 4,
						},
					},
					rectangle: boundary,
				})
			) {
				player.velocity.y = 0;
				break;
			} else {
				player.velocity.y = 4;
			}
		}
	} else if (
		(keys.d.pressed && lastKey === 'd') ||
		(keys.btn_right.pressed && lastKey === 'btn_right')
	) {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				collides({
					circle: {
						...player,
						velocity: {
							x: 4,
							y: 0,
						},
					},
					rectangle: boundary,
				})
			) {
				player.velocity.x = 0;
				break;
			} else {
				player.velocity.x = 4;
			}
		}
	}
	for (let i = ghosts.length - 1; i >= 0; i--) {
		const ghost = ghosts[i];
		if (
			Math.hypot(
				ghost.position.x - player.position.x,
				ghost.position.y - player.position.y,
			) <
				ghost.radius + player.radius &&
			!ghost.scared
		) {
			cancelAnimationFrame(animationId);
			clearInterval(intervalID);

			if (gameAudio) {
				gameAudio.pause();
			}
			let loseAudio = playAudio('soundLose', 0.5);
			setTimeout(() => {
				youLose();
			}, 2000);
		}
	}

	if (fruits.length === 0 && powerUps.length === 0) {
		cancelAnimationFrame(animationId);
		clearInterval(intervalID);

		if (gameAudio) {
			gameAudio.pause();
		}
		let winAudio = playAudio('soundWin', 1);
		setTimeout(() => {
			youWin();
		}, 2000);
	}

	for (let i = powerUps.length - 1; i >= 0; i--) {
		const powerUp = powerUps[i];
		powerUp.draw();

		if (
			Math.hypot(
				powerUp.position.x - player.position.x,
				powerUp.position.y - player.position.y,
			) <
			powerUp.radius + player.radius
		) {
			powerUps.splice(i, 1);

			ghosts.forEach((ghost) => {
				ghost.scared = true;

				setTimeout(() => {
					ghost.scared = false;
				}, 5000);
			});
		}
	}

	for (let i = fruits.length - 1; i >= 0; i--) {
		const fruit = fruits[i];
		fruit.draw();

		if (
			Math.hypot(
				fruit.position.x - player.position.x,
				fruit.position.y - player.position.y,
			) <
			fruit.radius + player.radius
		) {
			fruits.splice(i, 1);
			score += 10;
			scoreNumber.innerHTML = score;
		}
	}

	boundaries.forEach((boundary) => {
		boundary.draw();

		if (
			collides({
				circle: player,
				rectangle: boundary,
			})
		) {
			player.velocity.y = 0;
			player.velocity.x = 0;
		}
	});

	player.update();
	ghosts.forEach((ghost) => {
		ghost.update();

		const collisions = [];
		boundaries.forEach((boundary) => {
			if (
				!collisions.includes('right') &&
				collides({
					circle: {
						...ghost,
						velocity: {
							x: SPEED,
							y: 0,
						},
					},
					rectangle: boundary,
				})
			) {
				collisions.push('right');
			}
			if (
				!collisions.includes('left') &&
				collides({
					circle: {
						...ghost,
						velocity: {
							x: -SPEED,
							y: 0,
						},
					},
					rectangle: boundary,
				})
			) {
				collisions.push('left');
			}
			if (
				!collisions.includes('up') &&
				collides({
					circle: {
						...ghost,
						velocity: {
							x: 0,
							y: -SPEED,
						},
					},
					rectangle: boundary,
				})
			) {
				collisions.push('up');
			}
			if (
				!collisions.includes('down') &&
				collides({
					circle: {
						...ghost,
						velocity: {
							x: 0,
							y: SPEED,
						},
					},
					rectangle: boundary,
				})
			) {
				collisions.push('down');
			}
		});
		if (collisions.length > ghost.prevCollisions.length)
			ghost.prevCollisions = collisions;

		if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
			if (ghost.velocity.x > 0) ghost.prevCollisions.push('right');
			else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left');
			else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up');
			else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down');

			const pathways = ghost.prevCollisions.filter((collision) => {
				return !collisions.includes(collision);
			});

			const direction = pathways[Math.floor(Math.random() * pathways.length)];

			switch (direction) {
				case 'down':
					ghost.velocity.y = SPEED;
					ghost.velocity.x = 0;
					break;
				case 'up':
					ghost.velocity.y = -SPEED;
					ghost.velocity.x = 0;
					break;
				case 'right':
					ghost.velocity.y = 0;
					ghost.velocity.x = SPEED;
					break;
				case 'left':
					ghost.velocity.y = 0;
					ghost.velocity.x = -SPEED;
					break;
			}

			ghost.prevCollisions = [];
		}
	});

	if (player.velocity.x > 0) {
		player.rotation = 0;
	} else if (player.velocity.x < 0) {
		player.rotation = Math.PI;
	} else if (player.velocity.y < 0) {
		player.rotation = Math.PI * 1.5;
	} else if (player.velocity.y > 0) {
		player.rotation = Math.PI / 2;
	}
}

setInterval(animate(), 1000 / 60);

addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'w':
			keys.w.pressed = true;
			lastKey = 'w';
			break;
		case 'a':
			keys.a.pressed = true;
			lastKey = 'a';
			break;
		case 's':
			keys.s.pressed = true;
			lastKey = 's';
			break;
		case 'd':
			keys.d.pressed = true;
			lastKey = 'd';
			break;
	}
});

addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'w':
			keys.w.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
		case 's':
			keys.s.pressed = false;
			break;
		case 'd':
			keys.d.pressed = false;
			break;
	}
});

btnStart.addEventListener('click', () => {
	info.style.display = 'none';
	game.style.display = 'block';

	gameAudio = playAudio('soundGame', 0.5);
	startTime = Date.now();

	intervalID = setInterval(updateTime, 1000);
});
btn_up.addEventListener('click', () => {
	keys.btn_up.pressed = true;
	lastKey = 'btn_up';
});
btn_left.addEventListener('click', () => {
	keys.btn_left.pressed = true;
	lastKey = 'btn_left';
});
btn_down.addEventListener('click', () => {
	keys.btn_down.pressed = true;
	lastKey = 'btn_down';
});
btn_right.addEventListener('click', () => {
	keys.btn_right.pressed = true;
	lastKey = 'btn_right';
});
