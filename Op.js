(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    /** This class has no instances and is only used to make `Op<A>` not equivalent to `A`. */
    var NullType = (function () {
        function NullType() {
            throw new Error('Can\'t construct NoneType');
        }
        return NullType;
    }());
    exports.NullType = NullType;
    /**
    Use this as a type guard to convert `Op<A>` to `A`.
    Usually using another function such as [[caseOp]] is better.
    e.g.:
        const foo: Op<Foo> = ...
        if (nonNull(foo)) {
            // foo is a Foo in this block
        }
    */
    function nonNull(op) {
        /* tslint:disable:triple-equals */
        return op != null;
    }
    exports.nonNull = nonNull;
    /**
    Convert an Op<A> to A by replacing `null` values with a default.
    e.g.:
        orDefault(1, () => 2) ==> 1
        orDefault(null, () => 2) ==> 2
    */
    function orDefault(op, getDefault) {
        return nonNull(op) ? op : getDefault();
    }
    exports.orDefault = orDefault;
    /**
    Cast an `Op<A>` to `A`, throwing a TypeError it's null.
    e.g.:
        orThrow(1) ==> 1
        orThrow(null) ==> throws a TypeError
        orThrow(null, () => new Error('boo')) ==> throws a custom error
    */
    function orThrow(op, error) {
        if (error === void 0) { error = null; }
        if (nonNull(op))
            return op;
        else
            throw error === null ? new TypeError('Op was null.') : error();
    }
    exports.orThrow = orThrow;
    /**
    Create an Op that only has a value if `cond` is true.
    e.g.:
        function opHalf(n: number): Op<number> {
            return opIf(n % 2 === 0, () => n / 2)
        }
        opHalf(4) ==> 2
        opHalf(3) ==> null
    */
    function opIf(cond, makeOp) {
        return cond ? makeOp() : null;
    }
    exports.opIf = opIf;
    /**
    Perform `action` only on non-null Pps.
    e.g.:
        opEach(null, _ => console.log(_)) ==> does nothing
        opEach(1, _ => console.log(_)) ==> prints "1"
    */
    function opEach(op, action) {
        if (nonNull(op))
            action(op);
    }
    exports.opEach = opEach;
    /**
    Map an Op to another Op, doing nothing for null values.
    e.g.:
        opMap(null, _ => _ + 1) ==> null
        opMap(1, _ => _ + 1) ==> 2
    */
    function opMap(op, mapper) {
        return nonNull(op) ? mapper(op) : null;
    }
    exports.opMap = opMap;
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
    function caseOp(op, ifNonNull, ifNull) {
        return nonNull(op) ? ifNonNull(op) : ifNull();
    }
    exports.caseOp = caseOp;
    /**
    Map an array to Ops, then filter out null values.
    e.g.:
        flatMapOps([1, 2, 3, 4], _ => opIf(_ % 2 === 0, () => _ / 2)) ==> [1, 2]
    */
    function flatMapOps(array, opMapper) {
        var out = [];
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var em = array_1[_i];
            opEach(opMapper(em), function (_) { return out.push(_); });
        }
        return out;
    }
    exports.flatMapOps = flatMapOps;
});
//# sourceMappingURL=Op.js.map