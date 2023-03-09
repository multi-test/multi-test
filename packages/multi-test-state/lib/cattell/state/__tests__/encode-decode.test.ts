import createBlankCattellState from '../blank';
import {CattellState} from "../type";
import {decodeState} from "../decode";
import {encodeState} from '../encode';

describe('cattell.state.encode-decode integration', () => {
    let state: CattellState;

    beforeEach(() => {
        state = createBlankCattellState();
    });

    afterEach(() => {
        expect(decodeState(encodeState(state))).toEqual(state);
    });

    it('should create blank valid state matching the snapshot', () => {});

    it('should encode and decode position', () => {
        state.position = 1;
    });

    it('should encode and decode age', () => {
        state.profile.age = 70;
    });

    it('should encode and decode name', () => {
        state.profile.name = 'Test '.repeat(12);
    });

    it('should encode and decode male gender', () => {
        state.profile.gender = 'M';
    });

    it('should encode and decode female gender', () => {
        state.profile.gender = 'F';
    });

    it('should encode and decode A answers', () => {
        state.answers.fill('A');
    });

    it('should encode and decode B answers', () => {
        state.answers.fill('B');
    });

    it('should encode and decode C answers', () => {
        state.answers.fill('C');
    });

    it('should encode and decode complete state', () => {
        for (let i = 0; i < 187; i++) {
            state.answers[i] = (i % 2 === 0) ? 'A' : (i % 3 === 0 ? 'B' : 'C');
        }

        state.position = 189;
        state.profile.gender = 'M';
        state.profile.age = 70;
        state.profile.name = 'Иванов И.И.';
    });
});

