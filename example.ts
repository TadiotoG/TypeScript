class Person {
    name: string;
    age: number;

    constructor(name: string, age: number){
        this.name = name;
        this.age = age;
    }

    print_info(flag: number) {
        if(flag === 0){
            console.log("Not allowed");
        }
        else {
            console.log("Name: ", this.name);
            console.log("Age: ", this.age);
        }
    }
}

let Gabriel = new Person("Gabriel", 21);

Gabriel.print_info(1);