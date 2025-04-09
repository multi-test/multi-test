import sf36 from "./sf36";
import {createBlankScales} from "./scales";

describe(sf36.name, () => {
  // Test for invalid inputs
  test.each([
    ['undefined', [NaN], createBlankScales(NaN)],
    ['empty array', [], createBlankScales(NaN)],
    ['numeric', [1], createBlankScales(NaN)],
    ['array of wrong size', Array(20).fill(1), createBlankScales(NaN)],
    ['array with invalid values', Array(36).fill(10), createBlankScales(NaN)]
  ])('when given %s', (_, value, expected) => {
    expect(sf36(value)).toEqual(expected);
  });
  
  // Test for all 1 answers
  test('when all answers are 1', () => {
    const answers = Array(36).fill(1);
    const result = sf36(answers);
    
    // When all answers are 1, expect:
    // - Group1 items (1,2,20,22,34,36) = 100
    // - Group2 items (3-12) = 0
    // - Group3 items (13-19) = 0
    // - Group4 items (21,23,26,27,30) = 100
    // - Group5 items (24,25,28,29,31) = 0
    // - Group6 items (32,33,35) = 0
    
    // Expected averages:
    // PF (items 3-12): all 0 = 0
    // RP (items 13-16): all 0 = 0
    // RE (items 17-19): all 0 = 0
    // VT (items 23,27,29,31): 100,100,0,0 = 50
    // MH (items 24,25,26,28,30): 0,0,100,0,100 = 40
    // SF (items 20,32): 100,0 = 50
    // BP (items 21,22): 100,100 = 100
    // GH (items 1,33,34,35,36): 100,0,100,0,100 = 60
    
    expect(result.PF).toEqual(0);
    expect(result.RP).toEqual(0);
    expect(result.RE).toEqual(0);
    expect(result.VT).toEqual(50);
    expect(result.MH).toEqual(40);
    expect(result.SF).toEqual(50);
    expect(result.BP).toEqual(100);
    expect(result.GH).toEqual(60);
  });

  // Test for all 2 answers
  test('when all answers are 2', () => {
    const answers = Array(36).fill(2);
    const result = sf36(answers);
    
    // When all answers are 2, expect:
    // - Group1 items (1,2,20,22,34,36) = 75
    // - Group2 items (3-12) = 50
    // - Group3 items (13-19) = 100
    // - Group4 items (21,23,26,27,30) = 80
    // - Group5 items (24,25,28,29,31) = 20
    // - Group6 items (32,33,35) = 25
    
    // Expected averages:
    // PF (items 3-12): all 50 = 50
    // RP (items 13-16): all 100 = 100
    // RE (items 17-19): all 100 = 100
    // VT (items 23,27,29,31): 80,80,20,20 = 50
    // MH (items 24,25,26,28,30): 20,20,80,20,80 = 44
    // SF (items 20,32): 75,25 = 50
    // BP (items 21,22): 80,75 = 77.5
    // GH (items 1,33,34,35,36): 75,25,75,25,75 = 55
    
    expect(result.PF).toEqual(50);
    expect(result.RP).toEqual(100);
    expect(result.RE).toEqual(100);
    expect(result.VT).toEqual(50);
    expect(result.MH).toEqual(44);
    expect(result.SF).toEqual(50);
    expect(result.BP).toEqual(77.5);
    expect(result.GH).toEqual(55);
  });
}); 