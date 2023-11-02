const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 420;
canvas.height = 720;

const SIZE = 36;
const WIDTH = SIZE;
const HEIGHT = SIZE;
const SPEED = 2;

export { ctx, SIZE, WIDTH, HEIGHT, SPEED };
