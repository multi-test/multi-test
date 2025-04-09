import createBlankSF36State from "./state/blank";
import {decodeState} from "./state/decode";
import {encodeState} from "./state/encode";
import {validate} from "./state/validate";
import {Blank, SF36Answer, SF36State} from "./state/type";

export default class SF36StateWrapper implements SF36State {
  constructor(private readonly _state = createBlankSF36State()) {}

  /**
   * Create a new SF36StateManager from a base64 string
   * @param base64 The base64 encoded state string
   * @returns A new SF36StateManager instance
   */
  public static fromBase64(base64: string): SF36StateWrapper {
    try {
      const state = decodeState(base64);
      return new SF36StateWrapper(state);
    } catch (error) {
      console.error('Error decoding SF36 state:', error);
      return new SF36StateWrapper();
    }
  }

  /**
   * Serialize the state to a string
   * @returns A string representation of the state (name|birth date|comma-separated answers)
   */
  public toString(): string {
    return `${this.profile.name}|${this.profile.birthDate}|${this.answers.join('')}`;
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
  get answers(): Blank<SF36Answer>[] {
    return [...this._state.answers];
  }

  /**
   * Set answers array
   */
  set answers(answers: Blank<SF36Answer>[]) {
    this._state.answers = [...answers];
  }

  /**
   * Set an answer for a specific question
   * @param questionNumber The question number (1-36)
   * @param answer The answer value (1-6 or blank)
   */
  public setAnswer(questionNumber: number, answer: Blank<SF36Answer>): void {
    if (questionNumber < 1 || questionNumber > 36) {
      throw new Error(`Question number must be between 1 and 36, got ${questionNumber}`);
    }

    // Arrays are 0-indexed, questions are 1-indexed
    this._state.answers[questionNumber - 1] = answer;
  }

  /**
   * Get the answer for a specific question
   * @param questionNumber The question number (1-36)
   * @returns The answer value (1-6 or blank)
   */
  public getAnswer(questionNumber: number): Blank<SF36Answer> {
    if (questionNumber < 1 || questionNumber > 36) {
      throw new Error(`Question number must be between 1 and 36, got ${questionNumber}`);
    }

    return this._state.answers[questionNumber - 1];
  }

  // --- Profile accessors ---

  /**
   * Get profile object
   */
  get profile(): SF36State['profile'] {
    return { ...this._state.profile };
  }

  /**
   * Get patient name
   */
  get name(): string {
    return this._state.profile.name;
  }

  /**
   * Set patient name
   */
  set name(value: string) {
    this._state.profile.name = value;
  }

  /**
   * Get birth date as a Date object
   */
  get birthDate(): Date {
    return new Date(this._state.profile.birthDate);
  }

  /**
   * Set birthdate using a Date object
   */
  set birthDate(date: Date | number) {
    this._state.profile.birthDate = date instanceof Date ? date.getTime() : date;
  }

  // --- Validation methods ---

  /**
   * Validate the state
   * @returns Object with isValid flag and any errors
   */
  public validate(): { isValid: boolean; errors: string[] } {
    return validate(this._state);
  }

  /**
   * Get the current state
   * @returns The current state object
   */
  public toJSON() {
    return this._state;
  }
}
