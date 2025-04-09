import SF36State from "./sf36-state";

describe('SF36State', () => {
  it('should create a blank state', () => {
    const stateManager = new SF36State();
    
    // Check getters
    expect(stateManager.answers.length).toBe(36);
    expect(stateManager.answers.every(answer => answer === 0)).toBe(true);
    expect(stateManager.name).toBe('');
    expect(stateManager.birthDate.getTime()).toBe(0);
    
    const state = stateManager.toJSON();
    expect(state.answers.length).toBe(36);
    expect(state.profile.name).toBe('');
    expect(state.profile.birthDate).toBe(0);
  });

  it('should set and get answers', () => {
    const stateManager = new SF36State();
    
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
    const stateManager = new SF36State();
    const name = 'John Doe';
    const birthDate = new Date(1980, 0, 1);
    
    // Use property setters
    stateManager.name = name;
    stateManager.birthDate = birthDate;
    
    // Use property getters
    expect(stateManager.name).toBe(name);
    expect(stateManager.birthDate.getFullYear()).toBe(1980);
    expect(stateManager.birthDate.getMonth()).toBe(0);
    expect(stateManager.birthDate.getDate()).toBe(1);
    
    // Check profile getter
    const profile = stateManager.profile;
    expect(profile.name).toBe(name);
    expect(profile.birthDate).toBe(birthDate.getTime());
  });

  it('should validate the state', () => {
    const stateManager = new SF36State();
    
    // Empty state should be valid but not final
    expect(stateManager.validate().isValid).toBe(true);

    // Set required fields using property setters
    stateManager.name = 'Jane Doe';
    stateManager.birthDate = new Date(1990, 0, 1);
    
    // All answers must be filled for a final state
    for (let i = 1; i <= 36; i++) {
      stateManager.setAnswer(i, ((i % 6) + 1) as 1|2|3|4|5|6);
    }
    
    expect(stateManager.validate().isValid).toBe(true);
  });

  it('should encode with toBase64() and decode with static fromBase64', () => {
    const original = new SF36State();
    
    // Set some data using property setters
    original.name = 'Андрій Ґречны';
    original.birthDate = new Date(2000, 0, 1);
    original.setAnswer(1, 3);
    original.setAnswer(10, 2);
    original.setAnswer(20, 1);
    
    const base64 = original.toBase64();
    expect(typeof base64).toBe('string');
    expect(base64.length).toBeGreaterThan(0);
    
    // Decode from base64 using static method
    const decoded = SF36State.fromBase64(base64);
    
    // Verify data was preserved using property getters
    expect(decoded.name).toBe('Андрій Ґречны');
    
    const birthDate = decoded.birthDate;
    expect(birthDate.getFullYear()).toBe(2000);
    expect(birthDate.getMonth()).toBe(0);
    expect(birthDate.getDate()).toBe(1);
    
    expect(decoded.getAnswer(1)).toBe(3);
    expect(decoded.getAnswer(10)).toBe(2);
    expect(decoded.getAnswer(20)).toBe(1);
  });
});
