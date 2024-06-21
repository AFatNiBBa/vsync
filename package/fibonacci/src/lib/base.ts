
/**
 * Fibonacci sequence generator.
 * It is optimized for generating multiple close elements
 */
export class FibonacciGenerator {
	static readonly DEFAULT_PREV_1 = -1;
	static readonly DEFAULT_PREV_0 = 1;
	static readonly DEFAULT_CURRENT = 0;

	prev_1 = FibonacciGenerator.DEFAULT_PREV_1;
	prev_0 = FibonacciGenerator.DEFAULT_PREV_0;
	current = FibonacciGenerator.DEFAULT_CURRENT;

	/**
	 * Yields the elements of the sequence.
	 * The iteration CONTINUES from the current element 
	 */
	*[Symbol.iterator]() {
		while(true)
			yield this.next();
	}

	/** Resets the generator */
	reset() {
		this.prev_1 = FibonacciGenerator.DEFAULT_PREV_1;
		this.prev_0 = FibonacciGenerator.DEFAULT_PREV_0;
		this.current = FibonacciGenerator.DEFAULT_CURRENT;
	}

	/** Goes to the next element of the sequence */
	next() {
		const { prev_0, current } = this;
		const out = prev_0 + current;
		[ this.prev_1, this.prev_0, this.current ] = [ prev_0, current, out ];
		return out;
	}

	/** Goes to the previous element of the sequence */
	prev() {
		const { prev_1, prev_0 } = this;
		[ this.prev_1, this.prev_0, this.current ] = [ prev_0 - prev_1, prev_1, prev_0 ];
		return prev_0;
	}

	/**
	 * Changes the current element index by the given amount
	 * @param i The amount to sum to the current index
	 */
	shift(i = 1) {
		if (i < 0)
			while(-i++ > 0)
				this.prev();
		else
			while(i-- > 0)
				this.next();
		return this.current;
	}
}