/* eslint arrow-body-style: 0 */

import { maddi } from '@multi-test/core';
import 'surveys/common/button4.css';
import { buildMetaData } from 'surveys/common/builder';

const META = buildMetaData({
    className: 'Maddi',
    questionsCount: 45,
    answers: [
        { value: 0, cls: 'b b0' },
        { value: 1, cls: 'b b1' },
        { value: 2, cls: 'b b2' },
        { value: 3, cls: 'b b3' },
    ],
    scaleIds: [
      'commitment',
      'control',
      'challenge',
      'hardiness',
    ],
});

Object.values(META.scales).forEach((scale) => {
  Object.defineProperty(scale, 'displayId', {
    get() {
      return scale.text;
    },
  })
});

export default class Maddi {
    constructor() {
        this.answers = new Array(META.questionsCount);
    }

    get metaData() {
        return META;
    }

    calculate() {
      return maddi(this.answers);
    }
}
