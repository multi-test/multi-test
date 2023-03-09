import createBlankCattellState from '../blank';
import {Blank, CattelAnswer, CattellState, Gender} from "../type";
import {decodeState} from "../decode";
import {encodeState} from '../encode';

import * as _ from 'lodash';

function* listStates() {
    for (const position of _.times(190)) {
        const state = createBlankCattellState();
        for (let i = 0; i < Math.min(position, 187); i++) {
            state.answers[i] = ['A', 'B', 'C'][_.random(0, 3)] as Blank<CattelAnswer>;
        }
        if (state.position >= 187) {
            state.profile.gender = ['', 'M', 'F'][_.random(0, 2)] as Blank<Gender>;
        }
        if (state.position >= 188) {
            state.profile.age = _.random(16, 70)
        }
        if (state.position == 189) {
            state.profile.name = _.sample(['', 'Оґнєв Їжак Йосипович', 'Дымов Ашан Рысевич']) as string;
        }
        yield state;
    }
}

describe('cattell.state.encode-decode integration', () => {
    let n: number;
    let states: CattellState[];
    let hashes: string[];

    beforeAll(() => {
        states = [...listStates()];
        n = states.length;
        hashes = states.map(s => encodeState(s));
    });

    it('should encode well', () => {
        for (let j = 0; j < n; j++) {
            hashes[j] = encodeState(states[j]);
        }
    });

    it('should decode well', () => {
        for (let j = 0; j < n; j++) {
            states[j] = decodeState(hashes[j]);
        }
    });
});

