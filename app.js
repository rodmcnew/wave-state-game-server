var express = require('express');
//var routes = require('./routes');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 8080);

var width = 1;
var height = 40;
var maxX = width - 1;
var maxY = height - 1;
var springStiffness = .1;

//The Z's measure how much the field is distorted
var zs, velocities, forces;


function tick() {
    logzs();
    forEachPoint(calculateForce);
    forEachPoint(applyForce);
}

function calculateForce(y, x) {
    var top = 0, right = 0, bottom = 0, left = 0;
    var z = zs[y][x];
    if (y > 0) {
        top = z - zs[y - 1][x];
    }
    if (y < maxY) {
        bottom = z - zs[y + 1][x];
    }
    if (x < 0) {
        left = z - zs[y][x - 1];
    }
    if (x < maxX) {
        right = z - zs[y][x + 1];
    }
    //Divide by 2 to share the force across the spring
    forces[y][x] = (top + right + bottom + left) / 2 * springStiffness
}

function applyForce(y, x) {
    velocities[y][x] += forces[y][x];
    zs[y][x] += velocities[y][x];
    zs[y][x] = Math.round(zs[y][x]);
}

function init() {
    zs = [];
    forEachRow(function (y) {
        zs[y] = [];
    });
    forEachPoint(function (y, x) {
        zs[y][x] = 0;
    });

//Create 0-filled matrixes
    velocities = zs;
    forces = zs;

    zs[20][0] = 100;
}

function forEachPoint(callback) {
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            callback(y, x);
        }
    }
}

function forEachRow(callback) {
    for (var y = 0; y < height; y++) {
        callback(y);
    }
}

function logzs() {
    console.log();
    for (var y = 0; y < height; y++) {
        var row = '';
        for (var x = 0; x < width; x++) {
            row += ' ' + zs[y][x];
        }
        console.log(row);
    }
}

init();
setInterval(tick, 1000);

//http.createServer(app).listen(app.get('port'));
