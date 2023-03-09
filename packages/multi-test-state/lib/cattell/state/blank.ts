import {CattellState} from "./type";

export default function createBlankCattellState(): CattellState {
    return {
        position: 0,
        answers: new Array(187).fill(''),
        profile: {
            gender: '',
            age: 0,
            name: '',
        },
    };
}