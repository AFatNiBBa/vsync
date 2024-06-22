
import { FibonacciGenerator } from "./base";

/**
 * Version of {@link FibonacciGenerator} that is aware of its current index.
 * Allows you to go to an absolute position of the sequence
 */
export class IndexAwareFibonacciGenerator extends FibonacciGenerator {
	static readonly DEFAULT_INDEX = 0;

	/** Settable index of the current element of the sequence */
	get index() { return this.#index; }
	set index(v) { this.goto(v); }
	#index = IndexAwareFibonacciGenerator.DEFAULT_INDEX;

	/** @inheritdoc */
	reset() {
		this.#index = IndexAwareFibonacciGenerator.DEFAULT_INDEX;
		super.reset();
	}

	/** @inheritdoc */
	next() {
		this.#index++;
		return super.next();
	}

	/** @inheritdoc */
	prev() {
		this.#index--;
		return super.prev();
	}

	/**
	 * Go to an absolute position of the sequence.
	 * If the new index is closer to the start of the sequence than to the current position, the sequence gets resetted first
	 * @param i The desired index
	 */
	goto(i: number) {
		const shift = i - this.#index, shiftReset = i - IndexAwareFibonacciGenerator.DEFAULT_INDEX;
		if (Math.abs(shift) <= Math.abs(shiftReset)) return this.shift(shift);
		this.reset();
		return this.shift(shiftReset);
	}
}