"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Tipos básicos
let age = 5;
const firstName = "hayverson";
const isValid = true;
let idk = 5;
idk = '12';
idk = true;
const ids = [1, 2, 3, 4, 5];
const booleans = [true, false, true, false];
const names = ["hayverson", "gabriel"];
//tupla
const person = [1, "Hayverson"];
//lista de tuplas
const people = [
    [1, "hayverson"],
    [2, "gabriel"]
];
//intersections
const productId = '1';
//Enum
var Direction;
(function (Direction) {
    Direction[Direction["up"] = 1] = "up";
    Direction[Direction["down"] = 2] = "down";
})(Direction || (Direction = {}));
const direction = Direction.up;
console.log(direction);
//# sourceMappingURL=index.js.map