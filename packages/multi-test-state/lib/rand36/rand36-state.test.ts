import RAND36State from "./rand36-state";

describe('RAND36State', () => {
  it('should create a blank state', () => {
    const stateManager = new RAND36State();
    
    // Check getters
    expect(stateManager.answers.length).toBe(36);
    expect(stateManager.answers.every(answer => answer === 0)).toBe(true);
    expect(stateManager.name).toBe('');
    expect(stateManager.birthDate).toBe('');
    
    const state = stateManager.toJSON();
    expect(state.answers.length).toBe(36);
    expect(state.profile.name).toBe('');
    expect(state.profile.birthDate).toBe(0);
  });

  it('should set and get answers', () => {
    const stateManager = new RAND36State();
    
    stateManager.setAnswer(1, 1);
    stateManager.setAnswer(2, 2);
    stateManager.setAnswer(36, 5);
    
    expect(stateManager.getAnswer(1)).toBe(1);
    expect(stateManager.getAnswer(2)).toBe(2);
    expect(stateManager.getAnswer(36)).toBe(5);
    
    // Check answers array getter
    expect(stateManager.answers[0]).toBe(1);
    expect(stateManager.answers[1]).toBe(2);
    expect(stateManager.answers[35]).toBe(5);
  });

  it('should set and get profile data using getters and setters', () => {
    const stateManager = new RAND36State();
    const name = 'John Doe';
    const birthDate = '1980-01-01';
    
    // Use property setters
    stateManager.name = name;
    stateManager.birthDate = birthDate;
    
    // Use property getters
    expect(stateManager.name).toBe(name);
    expect(stateManager.birthDate).toBe(birthDate);
    
    // Check profile getter
    const profile = stateManager.profile;
    expect(profile.name).toBe(name);
    expect(profile.birthDate).toBe(1980 << 9 | 1 << 5 | 1);
  });

  it('should validate the state', () => {
    const stateManager = new RAND36State();
    
    // Empty state should be valid but not final
    expect(stateManager.validate().isValid).toBe(true);

    // Set required fields using property setters
    stateManager.name = 'Jane Doe';
    stateManager.birthDate = '1990-01-01';
    
    // All answers must be filled for a final state
    for (let i = 1; i <= 36; i++) {
      stateManager.setAnswer(i, ((i % 6) + 1) as 1|2|3|4|5|6);
    }
    
    expect(stateManager.validate().isValid).toBe(true);
  });

  it('should encode with toBase64() and decode with static fromBase64', () => {
    const original = new RAND36State();
    
    // Set some data using property setters
    original.name = 'Андрій Ґречны';
    original.birthDate = '2000-01-01';
    original.setAnswer(1, 3);
    original.setAnswer(10, 2);
    original.setAnswer(20, 1);
    
    const base64 = original.toBase64();
    expect(typeof base64).toBe('string');
    expect(base64.length).toBeGreaterThan(0);
    
    // Decode from base64 using static method
    const decoded = RAND36State.fromBase64(base64);
    
    // Verify data was preserved using property getters
    expect(decoded.name).toBe('Андрій Ґречны');
    expect(decoded.birthDate).toBe('2000-01-01');
    
    expect(decoded.getAnswer(1)).toBe(3);
    expect(decoded.getAnswer(10)).toBe(2);
    expect(decoded.getAnswer(20)).toBe(1);
  });

  it('should throw if name is invalid', () => {
    const stateManager = new RAND36State();
    expect(() => { stateManager.name = 'לאה גולדברג' }).toThrow('Encountered non-KOI8-U character');
  });

  it('should validate birth date format', () => {
    const stateManager = new RAND36State();

    // Valid dates
    expect(() => { stateManager.birthDate = '2000-01-01' }).not.toThrow();
    expect(() => { stateManager.birthDate = '1950-12-31' }).not.toThrow();

    // Invalid formats
    expect(() => { stateManager.birthDate = '2000/01/01' }).toThrow('Date must be in yyyy-mm-dd format');
    expect(() => { stateManager.birthDate = '01-01-2000' }).toThrow('Date must be in yyyy-mm-dd format');
    expect(() => { stateManager.birthDate = '2000-1-1' }).toThrow('Date must be in yyyy-mm-dd format');

    // Invalid ranges
    expect(() => { stateManager.birthDate = '0999-12-31' }).toThrow('Year must be between 1000 and 9999, got 999');
    expect(() => { stateManager.birthDate = '2000-00-01' }).toThrow('Month must be between 1 and 12, got 0');
    expect(() => { stateManager.birthDate = '2000-13-01' }).toThrow('Month must be between 1 and 12, got 13');
    expect(() => { stateManager.birthDate = '2000-01-00' }).toThrow('Day must be between 1 and 31, got 0');
    expect(() => { stateManager.birthDate = '2000-01-32' }).toThrow('Day must be between 1 and 31, got 32');
  });
});
