import { validateIntermediateCattellState, validateFinalCattellState } from '../validate';
import createBlankCattellState from "../blank";
import {CattellState} from "../type";

describe('cattell.state.validate', () => {
    const examples: [CattellState, boolean][] = [];

    function validateIntermediate(state: CattellState) {
        const result = validateIntermediateCattellState(state);
        examples.push([state, result]);

        return result;
    }

    describe('validateIntermediateCattellState', () => {
        let state: CattellState;

        beforeEach(() => {
            state = createBlankCattellState();
        });

        it('should consider valid: blank state', () =>
            expect(validateIntermediate(state)).toBe(true));

        it('should consider invalid: null', () =>
            expect(validateIntermediate(null as any)).toBe(false));

        describe('state.position', () => {
            it('< 0 - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    position: -1,
                })).toBe(false));

            it('>= 190 - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    position: 190,
                })).toBe(false));

            it('is floating point number - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    position: 0.5,
                })).toBe(false));

            it('is NaN - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    position: NaN,
                })).toBe(false));

            it('is a string - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    position: '0' as any,
                })).toBe(false));

            it('is undefined - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    position: undefined as any,
                })).toBe(false));

            it('is after unanswered question  - should be considered invalid', () => {
                state.position = 1;
                expect(validateIntermediate(state)).toBe(false);
                state.answers[0] = 'A';
                expect(validateIntermediate(state)).toBe(true);
            });
        });

        describe('state.answers', () => {
            it('is null - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    answers: null as any,
                })).toBe(false));

            it('is string - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    answers: 'A,B,C' as any,
                })).toBe(false));

            it('has length < 187 - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    answers: state.answers.splice(1),
                })).toBe(false));

            it('has length > 187 - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    answers: state.answers.concat(['']),
                })).toBe(false));

            it('has invalid elements - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    answers: ['X' as any].concat(state.answers.splice(1)),
                })).toBe(false));

            it('has A answer - should be considered valid', () =>
                expect(validateIntermediate({
                    ...state,
                    answers: ['A' as any].concat(state.answers.splice(1)),
                })).toBe(true));

            it('has B answer - should be considered valid', () =>
                expect(validateIntermediate({
                    ...state,
                    answers: ['B' as any].concat(state.answers.splice(1)),
                })).toBe(true));

            it('has C answer - should be considered valid', () =>
                expect(validateIntermediate({
                    ...state,
                    answers: ['C' as any].concat(state.answers.splice(1)),
                })).toBe(true));

            it('has answered question after unanswered - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    answers: ['', 'C' as any].concat(state.answers.splice(2)),
                })).toBe(false));
        });

        describe('state.profile', () => {
            it('is null - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: null as any,
                })).toBe(false));

            it('with no .age property - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        gender: state.profile.gender,
                        name: state.profile.name,
                    } as any,
                })).toBe(false));

            it('with no .gender property - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        age: state.profile.age,
                        name: state.profile.name,
                    } as any,
                })).toBe(false));

            it('with no .name property - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        age: state.profile.age,
                        gender: state.profile.gender,
                    } as any,
                })).toBe(false));

            it('with non-string .name property - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        name: 0xDEADBEEF as any,
                    },
                })).toBe(false));

            it('with 70 chars .name - should be considered valid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        name: 'A'.repeat(70),
                    },
                })).toBe(true));

            it('with more than 70 chars .name - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        name: 'A'.repeat(71),
                    },
                })).toBe(false));

            it('with .gender == 0 - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        gender: 0 as any,
                    },
                })).toBe(false));

            it('with .gender == M - should be considered valid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        gender: 'M',
                    },
                })).toBe(true));

            it('with .gender == F - should be considered valid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        gender: 'F',
                    },
                })).toBe(true));

            it('with .age == NaN - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        age: NaN,
                    },
                })).toBe(false));

            it('with .age == 0 - should be considered valid (blank)', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        age: 0,
                    },
                })).toBe(true));

            it('with .age < 16 - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        age: 15,
                    },
                })).toBe(false));

            it('with .age == 16 - should be considered valid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        age: 16,
                    },
                })).toBe(true));

            it('with .age == 16.5 - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        age: 16.5,
                    },
                })).toBe(false));

            it('with .age == 70 - should be considered valid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        age: 70,
                    },
                })).toBe(true));

            it('with .age > 70 - should be considered invalid', () =>
                expect(validateIntermediate({
                    ...state,
                    profile: {
                        ...state.profile,
                        age: 71,
                    },
                })).toBe(false));
        });
    });

    describe('validateFinalCattellState', () => {
        let state: CattellState;

        beforeEach(() => {
            state = {
                position: 189,
                answers: new Array(187).fill('A'),
                profile: {
                    gender: 'F',
                    age: 16,
                    name: 'A',
                },
            };
        });

        it('should consider completed Cattell state valid', () => {
            expect(validateFinalCattellState(state)).toBe(true);
        });

        it('should consider a state with last answer left blank invalid', () => {
            state.answers[186] = '';

            expect(validateFinalCattellState(state)).toBe(false);
            expect(validateIntermediateCattellState(state)).toBe(true);
        });

        it('should consider a state with missing gender invalid', () => {
            state.profile.gender = '';

            expect(validateFinalCattellState(state)).toBe(false);
            expect(validateIntermediateCattellState(state)).toBe(true);
        });

        it('should consider a state with missing age invalid', () => {
            state.profile.age = 0;

            expect(validateFinalCattellState(state)).toBe(false);
            expect(validateIntermediateCattellState(state)).toBe(true);
        });

        it('should consider a state with missing name invalid', () => {
            state.profile.name = '';

            expect(validateFinalCattellState(state)).toBe(false);
            expect(validateIntermediateCattellState(state)).toBe(true);
        });

        it('should consider blank cattell state invalid', () => {
            expect(validateFinalCattellState(createBlankCattellState())).toBe(false);
        });

        it('should consider any invalid cattell state also invalid', () => {
            const invalidStates: CattellState[] = examples
                .filter(([_, valid]) => !valid)
                .map(([state]) => state);

            invalidStates.forEach(state => {
                expect(validateFinalCattellState(state)).toBe(false);
            });
        });
    });
});
