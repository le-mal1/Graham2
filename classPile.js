class Pile {
    constructor() {
        this.array = [];
        this.length = this.array.length;
    }

    push(obj) {
        this.array.push(obj);
        this.length = this.array.length;
    }

    pop() {
        this.array.pop();
        this.length = this.array.length;
    }

    getTopElement() {
        if (this.array.length > 0)
            return this.array[this.array.length - 1];
        else
            return null;
    }
}