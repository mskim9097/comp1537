
class Customer {

    constructor(name, id) {
        this.n = name;
        this.ident = id;
    }

    get name() {
        return this.n;
    }

    get id() {
        return this.ident;
    }

    set name(value) {
        this.n = value;
    }

    toString() {
        return "Name: " + this.n + ", [id]: " + this.ident
    }
}


