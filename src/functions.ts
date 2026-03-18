interface mathFunc{
    (x: number, y: number): number;
}

const sum: mathFunc = (x: number, y: number) => {
    return x + y;
}

sum(2, 3);

const value = sum(2,3);

const log = (message: string): void => {
    console.log(message)
};

const sub: mathFunc = (x: number, y: number) => {
    return x - y;
}