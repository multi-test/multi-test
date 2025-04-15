import {compactToDate, dateToCompact} from "../utils/date-utils";
import createBlankRAND36State from "./state/blank";
import {decodeState} from "./state/decode";
import {encodeState} from "./state/encode";
import {validate} from "./state/validate";
import {Blank, RAND36Answer, RAND36State} from "./state/type";
import {encode as koi8encode } from "../utils/koi8-u";

export default class RAND36StateWrapper implements RAND36State {
  constructor(private readonly _state = createBlankRAND36State()) {}

  /**
   * Create a new RAND36StateManager from a base64 string
   * @param base64 The base64 encoded state string
   * @returns A new RAND36StateManager instance
   */
  public static fromBase64(base64: string): RAND36StateWrapper {
    const state = decodeState(base64);
    return new RAND36StateWrapper(state);
  }

  /**
   * Serialize the state to a string
   * @returns A string representation of the state (name|birth date|comma-separated answers)
   */
  public toString(): string {
    return `${this.name}|${this.birthDate}|${this.answers.join('')}`;
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
  get answers(): Blank<RAND36Answer>[] {
    return [...this._state.answers];
  }

  /**
   * Set answers array
   */
  set answers(answers: Blank<RAND36Answer>[]) {
    this._state.answers = [...answers];
  }

  /**
   * Set an answer for a specific question
   * @param questionNumber The question number (1-36)
   * @param answer The answer value (1-6 or blank)
   */
  public setAnswer(questionNumber: number, answer: Blank<RAND36Answer>): void {
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
  public getAnswer(questionNumber: number): Blank<RAND36Answer> {
    if (questionNumber < 1 || questionNumber > 36) {
      throw new Error(`Question number must be between 1 and 36, got ${questionNumber}`);
    }

    return this._state.answers[questionNumber - 1];
  }

  // --- Profile accessors ---

  /**
   * Get profile object
   */
  get profile(): RAND36State['profile'] {
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
    koi8encode(value); // will throw if invalid
    this._state.profile.name = value;
  }

  /**
   * Get birth date as yyyy-mm-dd string
   */
  get birthDate(): string {
    return compactToDate(this._state.profile.birthDate);
  }

  /**
   * Set birthdate using a yyyy-mm-dd string
   */
  set birthDate(value: string) {
    this._state.profile.birthDate = dateToCompact(value);
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
