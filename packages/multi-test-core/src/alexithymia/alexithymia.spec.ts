import alexithymia from "./alexithymia";
import {when_filled_with as wfw} from "../__utils__/helpers";

const when_filled_with = wfw(alexithymia, 26);

describe(alexithymia.name, () => {
  const calculate = (value) => 16 * (1 + value) + 10 * (5 - value);

  when_filled_with(undefined, { A: calculate(NaN) });
  when_filled_with(0, { A: calculate(0) });
  when_filled_with(1, { A: calculate(1) });
  when_filled_with(2, { A: calculate(2) });
  when_filled_with(3, { A: calculate(3) });
  when_filled_with(4, { A: calculate(4) });
});
