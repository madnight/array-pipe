import { Operator, TerminalOperator, someReduce } from '../src/operators';

describe('someReduce', () => {

    it('should be terminal', () => {
        const operator: Operator<number, boolean> = someReduce((n1: number, n2: number) => (n1+n2)%2 === 0);
        expect(operator.isTerminal()).toBeTruthy();
    });

    it('should have fallback value', () => {
        const operator: TerminalOperator<number, boolean> = someReduce((n1: number, n2: number) => (n1+n2)%2 === 0);
        expect(operator.getFallbackValue()).toBeFalsy();
    });

    it('should match criteria', () => {
        const operator: Operator<number, boolean> = someReduce((n1: number, n2: number) => (n1+n2)%2 === 0);
        expect(operator.perform(1)).toEqual({
            value: false,
            done: false
        });

        expect(operator.perform(3)).toEqual({
            value: true,
            done: true
        });
    });

    it('should not match criteria', () => {
        const operator: Operator<number, boolean> = someReduce((n1: number, n2: number) => (n1+n2)%2 === 0);
        expect(operator.perform(1)).toEqual({
            value: false,
            done: false
        });

        expect(operator.perform(4)).toEqual({
            value: false,
            done: false
        });
    });

});
