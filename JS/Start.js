//user settings
const fps = 30;

//left side
var initTempLeft = 20;
var numberOfParticlesLeft = 100;

//right side
var initTempRight = 10;
var numberOfParticlesRight = 200;

/*

DO NOT GO PASS THIS POINT IF YOU DONT KNOW WHAT YOU ARE DOING

*/

//settings
var backgroundColor = '#BFBFBF';
var particleColor = '#453FC0';
var barrierColor = '#ff0000';
var particleRadius = 0.5;
var canvasRatio = 2.1;
var isFriction = false;
var allowCrossOver = false
var particleMass = 5;

//global vars
var ctx;
var gameLoop;
var mouse;

$(function(){
	var canvas = document.getElementById('mainCanvas');
	var c = canvas.getContext('2d');
	ctx = c;
	printInputs();
	init(c);
	refreshSize();
});

function resetLoop(){
	clearInterval(gameLoop)
	init(ctx);
}

function init(c) {
	var particlesLeft = [];
	var particlesRight = [];
	
	//premake particle obj
	for (let i = 0; i < numberOfParticlesLeft; i++) {
		let initForce = new Point(0, 0);
		initForce.r = initTempLeft;
		initForce.deg = i * (360 / numberOfParticlesLeft);
		let initPoint = getPointOnCircle(((2 * numberOfParticlesLeft - 1) * particleRadius - 1) / (2 * Math.PI), i * (1 / numberOfParticlesLeft))
		initPoint.x += 50;
		initPoint.y += 50;

		makeParticle(initPoint, particleRadius, particleMass, initForce, particlesLeft);
	}
	
	for (let i = 0; i < numberOfParticlesRight; i++) {
		let initForce = new Point(0, 0);
		initForce.r = initTempRight;
		initForce.deg = i * (360 / numberOfParticlesRight);
		let initPoint = getPointOnCircle(((2 * numberOfParticlesRight - 1) * particleRadius - 1) / (2 * Math.PI), i * (1 / numberOfParticlesRight))
		initPoint.x += 160;
		initPoint.y += 50;

		makeParticle(initPoint, particleRadius, particleMass, initForce, particlesRight);
	}

	//initArrowKeys();

	//start loop
	gameLoop = setInterval(makeMainLoop(particlesLeft, particlesRight, 110), 1000 / fps);
}
window.onresize = refreshSize;

function makeParticle(initPoint, radius, mass, initForce, list) {
	var particle = new Point(initPoint.x, initPoint.y);
	particle.vel = new Point(0, 0);
	particle.mass = mass;
	particle.radius = radius;
	particle.applyForce = function (force) {
		accelleration = force.scale(1 / particle.mass);
		particle.vel.x += accelleration.x;
		particle.vel.y += accelleration.y;
	}
	particle.applyForce(initForce);
	particle.clickHandler = new Clickable(particle, radius);
	particle.clickHandler.onClick = function (startPoint) {
		particle.clickHandler.onRelease = function (endPoint) {
			var force = new Point(0, 0);
			force.x = particle.x - endPoint.x;
			force.y = particle.y - endPoint.y;
			particle.applyForce(force);
		}
	}
	list.push(particle);
}

function printInputs() {
	settingContainers = $('.setting');
	settingContainers.each(function (i, settingContainer) {
		var settingContainer = $(settingContainer);
		var type = settingContainer.attr('type');
		var varName = settingContainer.attr('var');

		var settingInput = $('<input/>');
		settingInput.attr('type', type);
		if (type == 'range') {
			var max = settingContainer.attr('max');
			var min = settingContainer.attr('min');
			settingInput.attr('max', max);
			settingInput.attr('min', min);
		}

		settingInput.change(function () {
			var self = $(this);
			var cont = self.parent();
			var varName = cont.attr('var');
			var value;
			if (self.attr('type') == 'checkbox') {
				value = self.prop('checked');
			} else {
				value = self.val();
			}
			if (self.attr('type') == 'range') {
				value = Number(value);
			}
			window[varName] = value;
		});


		settingContainer.append(varName + ': ');
		settingContainer.append(settingInput);
		settingContainer.append('<p></p>');
		var initValue = window[varName];
		if (settingInput.attr('type') == 'checkbox') {
			settingInput.attr('checked', initValue);
		} else {
			settingInput.val(initValue);
		}

	});
	$('[type="range"]').change(function(e){
		let target = $(this);
		target.parent().children('p').html(target.val())
	});
}

function refreshSize() {
	if (window.innerWidth < window.innerHeight) {
		ctx.canvas.width = window.innerWidth;
		ctx.canvas.height = window.innerWidth / canvasRatio;
		$('#settings').css('margin-top', ctx.canvas.height);
		$('#settings').css('margin-left', 0);
	} else {
		ctx.canvas.width = window.innerHeight;
		ctx.canvas.height = window.innerHeight / canvasRatio;
		$('#settings').css('margin-left', ctx.canvas.width);
		$('#settings').css('margin-top', 0);
	}

}

function getPointOnCircle(radius, time) {
	var point = new Point(1, 1);
	point.r = radius;
	point.rad = 2 * Math.PI * time
	return point;
}