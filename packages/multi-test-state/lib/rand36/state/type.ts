export type RAND36Answer = 1 | 2 | 3 | 4 | 5 | 6;
export type Blank<T> = 0 | T;

export interface RAND36Profile {
  /**
   * Patient name
   */
  name: string;
  /**
   * Birth date in compact 24-bit format
   */
  birthDate: number;
}

export interface RAND36State {
  profile: RAND36Profile;
  answers: (Blank<RAND36Answer>)[];
}
