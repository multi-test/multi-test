import {RAND36State} from "./type";

export default function createBlankRAND36State(): RAND36State {
    return {
        answers: new Array(36).fill(0),
        profile: {
            name: '',
            birthDate: 0,
        },
    };
} 
