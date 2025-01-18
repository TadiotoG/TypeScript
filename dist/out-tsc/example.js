var Person = /** @class */ (function () {
    function Person(name, age) {
        this.name = name;
        this.age = age;
    }
    Person.prototype.print_info = function (flag) {
        if (flag === 0) {
            console.log("Not allowed");
        }
        else {
            console.log("Name: ", this.name);
            console.log("Age: ", this.age);
        }
    };
    return Person;
}());
var Gabriel = new Person("Gabriel", 21);
Gabriel.print_info(1);
//# sourceMappingURL=example.js.map