import createBlankCattellState from "./state/blank";
import { encodeState } from "./state/encode";
import { decodeState } from "./state/decode";
import { CattellState, CattelAnswer, Gender, Blank } from "./state/type";
import { validateIntermediateCattellState } from "./state/validate";

export default class CattellStateWrapper implements CattellState {
    constructor(private readonly _state = createBlankCattellState()) {}

    /**
     * Create a new CattellStateWrapper from a base64 string
     * @param base64 The base64 encoded state string
     * @returns A new CattellStateWrapper instance
     */
    public static fromBase64(base64: string): CattellStateWrapper {
        try {
            const state = decodeState(base64);
            return new CattellStateWrapper(state);
        } catch (error) {
            console.error('Error decoding Cattell state:', error);
            return new CattellStateWrapper();
        }
    }

    /**
     * Get the Base64 string representation of this state
     * @returns Base64 encoded string
     */
    public toBase64(): string {
        return encodeState(this._state);
    }

    // --- Answer accessors ---

    /**
     * Get answers array
     */
    get answers(): Blank<CattelAnswer>[] {
        return [...this._state.answers];
    }

    /**
     * Set answers array
     */
    set answers(answers: Blank<CattelAnswer>[]) {
        this._state.answers = [...answers];
    }

    /**
     * Set an answer for a specific question
     * @param questionNumber The question number (1-187)
     * @param answer The answer value
     */
    public setAnswer(questionNumber: number, answer: Blank<CattelAnswer>): void {
        if (questionNumber < 1 || questionNumber > 187) {
            throw new Error(`Question number must be between 1 and 187, got ${questionNumber}`);
        }

        // Arrays are 0-indexed, questions are 1-indexed
        this._state.answers[questionNumber - 1] = answer;
    }

    /**
     * Get the answer for a specific question
     * @param questionNumber The question number (1-187)
     * @returns The answer value
     */
    public getAnswer(questionNumber: number): Blank<CattelAnswer> {
        if (questionNumber < 1 || questionNumber > 187) {
            throw new Error(`Question number must be between 1 and 187, got ${questionNumber}`);
        }

        return this._state.answers[questionNumber - 1];
    }

    // --- Profile accessors ---

    /**
     * Get profile object
     */
    get profile(): CattellState['profile'] {
        return { ...this._state.profile };
    }

    /**
     * Get gender
     */
    get gender(): Blank<Gender> {
        return this._state.profile.gender;
    }

    /**
     * Set gender
     */
    set gender(value: Blank<Gender>) {
        this._state.profile.gender = value;
    }

    /**
     * Get age
     */
    get age(): number {
        return this._state.profile.age;
    }

    /**
     * Set age
     */
    set age(value: number) {
        this._state.profile.age = value;
    }

    /**
     * Get name
     */
    get name(): string {
        return this._state.profile.name;
    }

    /**
     * Set name
     */
    set name(value: string) {
        this._state.profile.name = value;
    }

    /**
     * Get position
     */
    get position(): number {
        return this._state.position;
    }

    /**
     * Set position
     */
    set position(value: number) {
        this._state.position = value;
    }

    /**
     * Validate the state
     * @returns Whether the state is valid
     */
    public validate(): boolean {
        return validateIntermediateCattellState(this._state);
    }

    /**
     * Get the current state
     * @returns The current state object
     */
    public toJSON(): CattellState {
        return this._state;
    }
}
