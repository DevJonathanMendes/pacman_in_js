import { ctx, SIZE, WIDTH, HEIGHT } from './constants.js';

class Boundary {
	static width = WIDTH;
	static height = HEIGHT;
	constructor({ position, image }) {
		this.position = position;
		this.width = SIZE;
		this.height = SIZE;
		this.image = (() => {
			const img = new Image();
			img.src = image;
			return img;
		})();
	}

	draw() {
		ctx.drawImage(this.image, this.position.x, this.position.y);
	}
}

class Player {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;
		this.radius = 15;
		this.radians = 0.75;
		this.openRate = 0.1;
		this.rotation = 0;
	}

	draw() {
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);
		ctx.translate(-this.position.x, -this.position.y);
		ctx.beginPath();
		ctx.arc(
			this.position.x,
			this.position.y,
			this.radius,
			this.radians,
			Math.PI * 2 - this.radians,
		);
		ctx.lineTo(this.position.x, this.position.y);
		ctx.fillStyle = '#ff0';
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.radians < 0 || this.radians > 0.75) {
			this.openRate = -this.openRate;
		}
		this.radians += this.openRate;
	}
}

class Ghost {
	constructor({ position, velocity, color }) {
		this.position = position;
		this.velocity = velocity;
		this.radius = 15;
		this.color = color;
		this.prevCollisions = [];

		this.scared = false;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.scared ? '#00f' : this.color;
		ctx.fill();
		ctx.closePath();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

class Fruit {
	constructor({ position }) {
		this.position = position;
		this.radius = 3;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.closePath();
	}
}

class PowerUp {
	constructor({ position }) {
		this.position = position;
		this.radius = 8;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.closePath();
	}
}

export { Boundary, Player, Ghost, Fruit, PowerUp };
