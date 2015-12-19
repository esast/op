/**
Type for any value that might be `null` or `undefined`.
Use [[nonNull]], [[orDefault]], and [[orThrow]] to convert `Op<A>` to `A`.
*/
declare type Op<A> = A | NullType;
export default Op;
/** This class has no instances and is only used to make `Op<A>` not equivalent to `A`. */
export declare abstract class NullType {
    constructor();
    private member;
}
/**
Use this as a type guard to convert `Op<A>` to `A`.
Usually using another function such as [[caseOp]] is better.
e.g.:
    const foo: Op<Foo> = ...
    if (nonNull(foo)) {
        // foo is a Foo in this block
    }
*/
export declare function nonNull<A>(op: Op<A>): op is A;
/**
Convert an Op<A> to A by replacing `null` values with a default.
e.g.:
    orDefault(1, () => 2) ==> 1
    orDefault(null, () => 2) ==> 2
*/
export declare function orDefault<A>(op: Op<A>, getDefault: () => A): A;
/**
Cast an `Op<A>` to `A`, throwing a TypeError it's null.
e.g.:
    orThrow(1) ==> 1
    orThrow(null) ==> throws a TypeError
    orThrow(null, () => new Error('boo')) ==> throws a custom error
*/
export declare function orThrow<A>(op: Op<A>, error?: () => Error): A;
/**
Create an Op that only has a value if `cond` is true.
e.g.:
    function opHalf(n: number): Op<number> {
        return opIf(n % 2 === 0, () => n / 2)
    }
    opHalf(4) ==> 2
    opHalf(3) ==> null
*/
export declare function opIf<A>(cond: boolean, makeOp: () => A): Op<A>;
/**
Perform `action` only on non-null Pps.
e.g.:
    opEach(null, _ => console.log(_)) ==> does nothing
    opEach(1, _ => console.log(_)) ==> prints "1"
*/
export declare function opEach<A>(op: Op<A>, action: (a: A) => void): void;
/**
Map an Op to another Op, doing nothing for null values.
e.g.:
    opMap(null, _ => _ + 1) ==> null
    opMap(1, _ => _ + 1) ==> 2
*/
export declare function opMap<A, B>(op: Op<A>, mapper: (a: A) => B): Op<B>;
/**
Return a different result depending on whether `op` is null.
e.g.:
    function foo(op: Op<number>): number {
        return caseOp(op,
            _ => _ + 1,
            () => 0)
    }
    foo(1) ==> 2
    foo(null) ==> 0
*/
export declare function caseOp<A, B>(op: Op<A>, ifNonNull: (a: A) => B, ifNull: () => B): B;
/**
Map an array to Ops, then filter out null values.
e.g.:
    flatMapOps([1, 2, 3, 4], _ => opIf(_ % 2 === 0, () => _ / 2)) ==> [1, 2]
*/
export declare function flatMapOps<A, B>(array: Array<A>, opMapper: (element: A) => Op<B>): Array<B>;
