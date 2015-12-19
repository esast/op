/**
Type for any value that might be `null` or `undefined`.
Use [[nonNull]], [[orDefault]], and [[orThrow]] to convert `Op<A>` to `A`.
*/
type Op<A> = A | NullType
export default Op

/** This class has no instances and is only used to make `Op<A>` not equivalent to `A`. */
export abstract class NullType {
	constructor() { throw new Error('Can\'t construct NoneType') }
	// This ensures that nothing is a NullType.
	/* tslint:disable:no-unused-variable */
	private member: number
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
export function nonNull<A>(op: Op<A>): op is A {
	/* tslint:disable:triple-equals */
	return op != null
}

/**
Convert an Op<A> to A by replacing `null` values with a default.
e.g.:
	orDefault(1, () => 2) ==> 1
	orDefault(null, () => 2) ==> 2
*/
export function orDefault<A>(op: Op<A>, getDefault: () => A): A {
	return nonNull(op) ? op : getDefault()
}

/**
Cast an `Op<A>` to `A`, throwing a TypeError it's null.
e.g.:
	orThrow(1) ==> 1
	orThrow(null) ==> throws a TypeError
	orThrow(null, () => new Error('boo')) ==> throws a custom error
*/
export function orThrow<A>(op: Op<A>, error: () => Error = null): A {
	if (nonNull(op))
		return op
	else
		throw error === null ? new TypeError('Op was null.') : error()
}

/**
Create an Op that only has a value if `cond` is true.
e.g.:
	function opHalf(n: number): Op<number> {
		return opIf(n % 2 === 0, () => n / 2)
	}
	opHalf(4) ==> 2
	opHalf(3) ==> null
*/
export function opIf<A>(cond: boolean, makeOp: () => A): Op<A> {
	return cond ? makeOp() : null
}

/**
Perform `action` only on non-null Pps.
e.g.:
	opEach(null, _ => console.log(_)) ==> does nothing
	opEach(1, _ => console.log(_)) ==> prints "1"
*/
export function opEach<A>(op: Op<A>, action: (a: A) => void): void {
	if (nonNull(op))
		action(op)
}

/**
Map an Op to another Op, doing nothing for null values.
e.g.:
	opMap(null, _ => _ + 1) ==> null
	opMap(1, _ => _ + 1) ==> 2
*/
export function opMap<A, B>(op: Op<A>, mapper: (a: A) => B): Op<B> {
	return nonNull(op) ? mapper(op) : null
}

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
export function caseOp<A, B>(op: Op<A>, ifNonNull: (a: A) => B, ifNull: () => B): B {
	return nonNull(op) ? ifNonNull(op) : ifNull()
}

/**
Map an array to Ops, then filter out null values.
e.g.:
	flatMapOps([1, 2, 3, 4], _ => opIf(_ % 2 === 0, () => _ / 2)) ==> [1, 2]
*/
export function flatMapOps<A, B>(array: Array<A>, opMapper: (element: A) => Op<B>): Array<B> {
	const out: Array<B> = []
	for (const em of array)
		opEach(opMapper(em), _ => out.push(_))
	return out
}
