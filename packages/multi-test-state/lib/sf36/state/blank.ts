import {SF36State} from "./type";

export default function createBlankSF36State(): SF36State {
    return {
        answers: new Array(36).fill(0),
        profile: {
            name: '',
            birthDate: 0,
        },
    };
} 
