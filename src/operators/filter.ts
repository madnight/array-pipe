import Operator from "./operator";

interface Predicate<T> {
    (item: T): boolean;
}

class FilterOperator<T> extends Operator<T, T> {

    constructor(private tester: Predicate<T>) {
        super();
    }

    public isTerminal(): boolean {
        return false;
    }

    protected perform(from: T): T {
        return this.tester(from) ? from : undefined;
    }
}

export default function filter<T>(tester: Predicate<T>): Operator<T, T> {
    return new FilterOperator<T>(tester);
}
