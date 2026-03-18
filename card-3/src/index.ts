//Tipos básicos
let age: number = 5;
const firstName: string = "hayverson"
const isValid: boolean = true
let idk: any = 5

idk = '12'
idk = true

const ids: number[] = [1, 2, 3, 4, 5]
const booleans: boolean[] = [true, false, true, false]
const names: string[] = ["hayverson", "gabriel"]

//tupla
const person: [number, string] = [1, "Hayverson"]

//lista de tuplas
const people: [number, string][] = [
    [1, "hayverson"],
    [2, "gabriel"]
]

//intersections
const productId: string | number = '1'

//Enum
enum Direction {
    up = 1,
    down = 2,
    left = 'esquerda'
}

const direction = Direction.left;

//type assertions
const productName: any = 'boné';

// let itemId = productName as string;
let itemId = <string>productName;

console.log(direction);