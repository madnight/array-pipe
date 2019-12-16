export interface OperatorResult<T> {

    value: T;
    skip: boolean;
    needsFlattening: boolean;

}

export abstract class Operator<F, T> {

    protected next: Operator<T, any>;

    public abstract perform(from: F): OperatorResult<T>;

    public abstract isTerminal(): boolean;

}

export abstract class TerminalOperator<F, T> extends Operator<F, T> {
    public isTerminal() {
        return true;
    }

    public abstract getFallbackValue(): T;
}

export abstract class IntermediateOperator<F, T> extends Operator<F, T> {
    public isTerminal() {
        return false;
    }
}

interface Predicate<T> {
    (item: T): boolean;
}

interface Mapper<F, T> {
    (from: F): T;
}

class DistinctOperator extends IntermediateOperator<any, any> {

    private pastValues: Set<any> = new Set();

    public perform(from: any): OperatorResult<any> {
        if (this.pastValues.has(from)) {
            return {
                value: from,
                skip: true,
                needsFlattening: false
            };
        } else {
            this.pastValues.add(from);
            return {
                value: from,
                skip: false,
                needsFlattening: false
            };
        }
    }
}

export function distinct(): IntermediateOperator<any, any> {
    return new DistinctOperator();
};

class EveryOperator<T> extends TerminalOperator<T, boolean> {

    constructor(private tester: Predicate<T>) {
        super();
    }

    public getFallbackValue(): boolean {
        return true;
    }

    public perform(from: T): OperatorResult<boolean> {
        if (!this.tester(from)) {
            return {
                value: false,
                skip: false,
                needsFlattening: false
            };
        }
        return {
            value: null,
            skip: true,
            needsFlattening: false
        };
    }
}

export function every<T>(tester: Predicate<T>): TerminalOperator<T, boolean> {
    return new EveryOperator<T>(tester);
}

class FilterOperator<T> extends IntermediateOperator<T, T> {

    constructor(private tester: Predicate<T>) {
        super();
    }

    public perform(from: T): OperatorResult<T> {
        return {
            value: from,
            skip: !this.tester(from),
            needsFlattening: false
        };
    }
}

export function filter<T>(tester: Predicate<T>): IntermediateOperator<T, T> {
    return new FilterOperator<T>(tester);
}

class FirstOperator<T> extends TerminalOperator<T, T> {

    constructor(private tester: Predicate<T>) {
        super();
    }

    public getFallbackValue(): T {
        return null;
    }

    public perform(from: T): OperatorResult<T> {
        return {
            value: from,
            skip: !this.tester(from),
            needsFlattening: false
        };
    }
}

export function first<T>(tester: Predicate<T>): TerminalOperator<T, T> {
    return new FirstOperator<T>(tester);
}

class FlatMapOperator<F, T> extends IntermediateOperator<F, T> {

    constructor(private mapper: Mapper<F, T>) {
        super();
    }

    public perform(from: F): OperatorResult<T> {
        return {
            value: this.mapper(from),
            skip: false,
            needsFlattening: true
        };
    }

}

export function flatMap<F, T extends Array<any>>(mapper: Mapper<F, T>): IntermediateOperator<F, T> {
    return new FlatMapOperator<F, T>(mapper);
}

class MapOperator<F, T> extends IntermediateOperator<F, T> {

    constructor(private mapper: Mapper<F, T>) {
        super();
    }

    public perform(from: F): OperatorResult<T> {
        return {
            value: this.mapper(from),
            skip: false,
            needsFlattening: false
        };
    }

}

export function map<F, T>(mapper: Mapper<F, T>): IntermediateOperator<F, T> {
    return new MapOperator<F, T>(mapper);
}

class SomeOperator<T> extends TerminalOperator<T, boolean> {

    constructor(private tester: Predicate<T>) {
        super();
    }

    public getFallbackValue(): boolean {
        return false;
    }

    public perform(from: T): OperatorResult<boolean> {
        if (this.tester(from)) {
            return {
                value: true,
                skip: false,
                needsFlattening: false
            };
        }
        return {
            value: null,
            skip: true,
            needsFlattening: false
        };
    }
}

export function some<T>(tester: Predicate<T>): TerminalOperator<T, boolean> {
    return new SomeOperator<T>(tester);
}