import {createBlankScales} from "./scales";
import usk from "./usk";
import {should_equal, when_filled_with as wfw} from "../__utils__/helpers";

const when_filled_with = wfw(usk, 44);

describe(usk.name, () => {
  when_filled_with(undefined, createBlankScales(NaN));

  when_filled_with(-3, {
    "Ио": 3,
    "Ид": 4,
    "Ин": 3,
    "Ис": 5,
    "Ип": 3,
    "Им": 5,
    "Из": 3,
  });

  when_filled_with(-2, {
    "Ио": 3,
    "Ид": 4,
    "Ин": 3,
    "Ис": 5,
    "Ип": 3,
    "Им": 5,
    "Из": 3,
  });

  when_filled_with(-1, {
    "Ио": 3,
    "Ид": 4,
    "Ин": 3,
    "Ис": 5,
    "Ип": 3,
    "Им": 5,
    "Из": 3,
  });

  when_filled_with(0, createBlankScales(NaN));

  when_filled_with(1, {
    "Ио": 3,
    "Ид": 4,
    "Ин": 3,
    "Ис": 5,
    "Ип": 3,
    "Им": 5,
    "Из": 3,
  });

  when_filled_with(2, {
    "Ио": 3,
    "Ид": 4,
    "Ин": 3,
    "Ис": 5,
    "Ип": 3,
    "Им": 5,
    "Из": 3,
  });

  when_filled_with(3, {
    "Ио": 3,
    "Ид": 4,
    "Ин": 3,
    "Ис": 5,
    "Ип": 3,
    "Им": 5,
    "Из": 3,
  });

  describe("given a sample suite #1", () => {
    let answers;

    beforeEach(() => answers = [
      1, 2, -2,
      3, -2, -1,
      -2, -3, -2,
      -2, 2, 2,
      3, 1, 2,
      -1, -2, 2,
      3, 1, 2,
      3, -3, -3,
      2, -1, -2,
      -3, 2, 2,
      2, 2, -2,
      -2, -1, 2,
      2, -1, 3,
      -2, 2, -1,
      3, 2,
    ]);

    const expected = {
      "Ио": 7,
      "Ид": 6,
      "Ин": 8,
      "Ис": 7,
      "Ип": 5,
      "Им": 6,
      "Из": 7,
    };

    it(should_equal(expected), () => {
      expect(usk(answers)).toEqual(expected);
    });
  });
});
