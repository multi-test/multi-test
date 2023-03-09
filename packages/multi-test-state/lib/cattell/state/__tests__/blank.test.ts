import createBlankCattellState from '../blank';
import {CattellState} from "../type";

describe('cattell.state.blank', () => {
    let state: CattellState;

    beforeEach(() => {
        state = createBlankCattellState();
    });

    it('should create blank valid state matching the snapshot', () => {
        expect(state).toMatchSnapshot();
    });
});