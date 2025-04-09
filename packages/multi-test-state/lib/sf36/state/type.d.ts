export type SF36Answer = 1 | 2 | 3 | 4 | 5 | 6;
export type Blank<T> = 0 | T;

export interface SF36Profile {
  name: string;
  birthDate: number;
}

export interface SF36State {
  profile: SF36Profile;
  answers: (Blank<SF36Answer>)[];
}
