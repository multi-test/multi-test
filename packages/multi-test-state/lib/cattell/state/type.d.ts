export type Gender = 'M' | 'F';
export type CattelAnswer = 'A' | 'B' | 'C';
export type Blank<T> = T | '';

export type CattellState = {
    position: number;
    answers: Blank<CattelAnswer>[];
    profile: {
        gender: Blank<Gender>;
        age: number;
        name: string;
    };
};

export type FinalCattellState = {
    position: number;
    answers: CattelAnswer[];
    profile: {
        gender: Gender;
        age: number;
        name: string;
    };
};
