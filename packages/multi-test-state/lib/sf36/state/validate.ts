import {SF36State} from "./type";

const VALID_ANSWERS = new Set<unknown>([0, 1, 2, 3, 4, 5, 6]);

function containsOnlyValidAnswers(answers: unknown[]): boolean {
    if (answers.length !== 36) {
        return false;
    }

    for (const answer of answers) {
        if (!VALID_ANSWERS.has(answer)) {
            return false;
        }
    }

    return true;
}

export function validate(state: SF36State): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!state) {
        return { isValid: false, errors: ['State is missing'] };
    }

    if (!state.answers || !Array.isArray(state.answers)) {
        errors.push('Answers are missing or not an array');
    } else if (!containsOnlyValidAnswers(state.answers)) {
        errors.push('Answers contain invalid values');
    }

    if (!state.profile) {
        errors.push('Profile is missing');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
