import { Operator, TerminalOperator } from "./operator";
import every from './every';

describe('every', () => {

    it('should be terminal', () => {
        const operator: Operator<number, boolean> = every((n: number) => n%2 === 0);
        expect(operator.isTerminal()).toBeTruthy();
    });

    it('should have fallback value', () => {
        const operator: TerminalOperator<number, boolean> = every((n: number) => n%2 === 0);
        expect(operator.getFallbackValue()).toBeTrue();
    });

    it('should match criteria', () => {
        const operator: Operator<number, boolean> = every((n: number) => n%2 === 0);
        expect(operator.performChain(4)).toBeUndefined();
    });

    it('should not match criteria', () => {
        const operator: Operator<number, boolean> = every((n: number) => n%2 === 0);
        expect(operator.performChain(5)).toBeFalse();
    });

});