// params
var range = 10;
var scale = 300;
var level = 10;
var octave = 0.6;

// variables
var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')
var width = window.innerWidth;
var height = window.innerHeight;
canvas.width = width;
canvas.height = height;
var randGradients = new Array(level);
var auto = false;

window.addEventListener('resize', () => {
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
});

// functions
function perlin(x) {
	let xi = Math.floor(x);
	if (xi == x) {
		return 0;
	}
	var n = 0;
	var amplitude = 1;
	var maxVal = 0;
	for (var l = 0; l < level; ++l, amplitude *= octave) {
		let x1 = x * (2 ** l);
		let xi = Math.floor(x1);
		let xj = xi + 1;
		let d0 = dotGridGradient(l, xi, x1);
		let d1 = dotGridGradient(l, xj, x1);
		n += interp(x1 - xi, d0, d1) * amplitude;
		maxVal += amplitude;
	}
	
	return n / maxVal;
}

function gerateRandGradient() {
	for (var l = 0; l < level; ++l) {
		let len = (2 ** l) * range;
		randGradients[l] = new Array(len);
		for (var i = 0; i < len; ++i) {
			randGradients[l][i] = 2 * (Math.random() > 0.5) - 1;
		}
	}
}

function dotGridGradient(l, i, x) {
	let dx = x - i;
	return dx * randGradients[l][i];
}

function interp(x, v0, v1) {
	return v0 + f1(x) * (v1 - v0);
}

function f0(x) {
	let x2 = x * x;
	let x3 = x2 * x;
	return 3 * x2 - 2 * x3;
}

function f1(x) {
	let x3 = x * x * x;
	let x4 = x3 * x;
	let x5 = x4 * x;
	return 6 * x5 - 15 * x4 + 10 * x3;
}

function getY(y) {
	return scale * y + height / 2;
}

function generate() {
	level = document.querySelector('#level').value
	octave = document.querySelector('#octave').value
	gerateRandGradient();
	if (document.querySelector('#clear').checked) {
		ctx.clearRect(0, 0, width, height);
	}
	ctx.beginPath();
	ctx.moveTo(0, getY(0));
	for (var i = 1; i <= width; ++i) {
		let x = i / width * (range - 1);
		ctx.lineTo(i, getY(perlin(x)));
	}
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
}

function animation() {
	if (auto) {
		requestAnimationFrame(animation);
		generate();
	}
}

function toggleAuto() {
	if (auto) {
		auto = false;
	} else {
		auto = true;
		animation();
	}
}

generate();
animation();