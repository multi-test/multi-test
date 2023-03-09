import {CattellState, FinalCattellState} from "./type";

export function validateIntermediateCattellState(state: CattellState): boolean {
    if (state == null) {
        return false;
    }

    if (!validatePosition(state)) {
        return false;
    }

    if (!validateProfile(state)) {
        return false;
    }

    if (!validateAnswers(state)) {
        return false;
    }

    return true;
}

function validatePosition(state: CattellState): boolean {
    if (!validateIntegerRange(0, state.position, 189)) {
        return false;
    }

    const pos = Math.min(186, state.position);
    for (let i = 0; i < pos; i++) {
        if (state.answers[i] === '') {
            return false;
        }
    }

    return true;
}

function validateAnswers(state: CattellState): boolean {
    if (!validateArray(state.answers, 187, validateAnswer)) {
        return false;
    }

    let unanswered = false;
    for (const answer of state.answers) {
        if (answer === '') {
            unanswered = true;
        } else if (unanswered) {
            return false;
        }
    }

    return true;
}

function validateAnswer(answer: any): answer is ('A' | 'B' | 'C' | '') {
    switch (answer) {
        case '':  return true;
        case 'A': return true;
        case 'B': return true;
        case 'C': return true;
        default:  return false;
    }
}

function validateProfile(state: CattellState): boolean {
    const profile = state.profile;

    if (!profile) {
        return false;
    }

    if (!profile.hasOwnProperty('gender')) {
        return false;
    }

    if (!profile.hasOwnProperty('age')) {
        return false;
    }

    if (!profile.hasOwnProperty('name')) {
        return false;
    }

    return (validateAge(profile.age)
        && validateGender(profile.gender)
        && validateName(profile.name));
}

function validateGender(gender: any): boolean {
    switch (gender) {
        case 'M': return true;
        case 'F': return true;
        case '': return true;
        default: return false;
    }
}

function validateAge(age: any): boolean {
    return age === 0 || validateIntegerRange(16, age, 70);
}

function validateIntegerRange(min: number, value: any, max: number): value is number {
    if (typeof value !== 'number') {
        return false;
    }

    if (!isFinite(value)) {
        return false;
    }

    if (Math.floor(value) !== value) {
        return false;
    }

    return (min <= value) && (value <= max);
}

function validateArray<T>(array: any[], length: number, isValid: (value: any) => value is T): array is T[] {
    if (!array) {
        return false;
    }

    if (!Array.isArray(array)) {
        return false;
    }

    if (array.length !== length) {
        return false;
    }

    for (const value of array) {
        if (!isValid(value)) {
            return false;
        }
    }

    return true;
}

function validateName(name: any): name is string {
    if (typeof name !== 'string') {
        return false;
    }

    if (name.length > 70) {
        return false;
    }

    return true;
}

export function validateFinalCattellState(state: CattellState): state is FinalCattellState {
    if (!validateIntermediateCattellState(state)) {
        return false;
    }

    if (state.position !== 189) {
        return false;
    }

    for (const answer of state.answers) {
        if (answer === '') {
            return false;
        }
    }

    if (state.profile.gender === '') {
        return false;
    }

    if (state.profile.age === 0) {
        return false;
    }

    if (state.profile.name === '') {
        return false;
    }

    return true;
}
