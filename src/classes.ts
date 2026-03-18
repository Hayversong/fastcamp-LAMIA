interface IPerson{
    id: number;
    sayMyName(): string;
}


class Person implements IPerson{
    readonly id: number;
    protected name: string;
    private age: number;

    constructor(id: number, name: string, age: number){
        this.id = id;
        this.name = name;
        this.age = age;
    }

    sayMyName(){
        return this.name; 
    }
}

class Employee extends Person{
    constructor(id: number, name: string, age: number){
        super(id, name, age)
    }

    whoAmI(){
        return this.age;
    }
}

const hay = new Person(1, "hayverson", 22);