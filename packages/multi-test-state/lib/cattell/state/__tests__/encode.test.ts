import {encodeState} from '../encode';
import createBlankCattellState from '../blank';
import {CattellState} from "../type";

describe('cattell.state.encode', () => {
    let state: CattellState;

    beforeEach(() => {
        state = createBlankCattellState();
    });

    afterEach(() => {
        const base64 = encodeState(state);
        expect(base64).toMatchSnapshot();
    });

    it('should create blank valid state matching the snapshot', () => {});

    it('should encode position', () => {
        state.position = 1;
    });

    it('should encode age', () => {
        state.profile.age = 70;
    });

    it('should encode name', () => {
        state.profile.name = 'Иванов '.repeat(10);
    });

    it('should encode male gender', () => {
        state.profile.gender = 'M';
    });

    it('should encode female gender', () => {
        state.profile.gender = 'F';
    });

    it('should encode A answers', () => {
        state.answers.fill('A');
    });

    it('should encode B answers', () => {
        state.answers.fill('B');
    });

    it('should encode C answers', () => {
        state.answers.fill('C');
    });

    it('should encode complete state', () => {
        for (let i = 0; i < 187; i++) {
            state.answers[i] = (i % 2 === 0) ? 'A' : (i % 3 === 0 ? 'B' : 'C');
        }

        state.position = 189;
        state.profile.gender = 'M';
        state.profile.age = 70;
        state.profile.name = 'Иванов И.И.';
    });
});

