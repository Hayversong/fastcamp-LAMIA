//type
type Order = {
    productId: string;
    price: number
}

type User = {
    firstName: string;
    age: number;
    email: string;
    password?: string;
    orders: Order[];
    register(): string;
};

const user: User = {
    firstName: 'Jane',
    age: 20,
    email: 'jane@doe.com',
    password: '12345',
    orders: [{productId: "1", price: 200}],
    register(){
        return "a"
    }
}

//unions
type Author = {
    books: string[]
}

const author: Author & User = {
    age: 2,
    books: ['1'],
    email: "author@gmail.com",
    firstName: 'Hayverson',
    orders: [],
    register(){
        return "a"
    }
};

// Interfaces
interface UserInterface {
    readonly firstName: string;
    email: string;
    login(): string
}

const emailUser: UserInterface = {
    email: 'hayverson@gmail.com',
    firstName: 'hayverson',
    login(){
        return "a";
    },
}

interface authorInterface {
    books: string[];
}

const newAuthor: UserInterface & authorInterface = {
    email: "author@gmail.com",
    firstName: "hayverson",
    books: [],
    login(){
        return "a"
    }
}

type Grade = number | string;
const grade: Grade = 1;