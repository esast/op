Op provides a type of nullable values in TypeScript,
which doesn't have one ([yet](https://github.com/Microsoft/TypeScript/issues/185)).

It is not a new type; it just defines `type Op<A> = A | NullType` where `NullType` has no values.

Since all TypeScript types are nullable by default, any nullable value can be assigned to an Op.

But since Op is its own type, you can't accidentally assign an `Op<A>` to an `A`.

Use this along with a coding style where *every* nullable value is wrapped in `Op`,
and you have null safety.

This package also provides functions for dealing with nullable values,
so it will continue to be useful in the future.


## Use

**Op only works in typescript 1.8.0+!**

Install:

	npm install --save esast/op
	# or:
	bower install --save esast/op

In your code:

```typescript
import Op, {orDefault} from 'op/Op'

// Wrap nullable types in `Op`.
const opNum: Op<number> = null
// Use helper functions to get null-safe values.
const num: number = orDefault(opNum, () => 0)
```

The package should work in both CommonJS and AMD environments.


## Documentation

HTML documentation coming soon!
For now, see [Op.ts](https://github.com/esast/op/blob/master/Op.ts).


## Contribute

Please make an issue if there's anything you'd like added or changed.
