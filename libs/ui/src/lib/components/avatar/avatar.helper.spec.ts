import { initialsOf } from './avatar.helper';

describe('initialsOf', () => {
  it('takes the first letters of at most two words, upper-cased', () => {
    expect(initialsOf('ada lovelace')).toBe('AL');
    expect(initialsOf('Grace Brewster Hopper')).toBe('GB');
  });

  it('handles one word, extra whitespace and an empty name', () => {
    expect(initialsOf('Linus')).toBe('L');
    expect(initialsOf('  Ada   Lovelace ')).toBe('AL');
    expect(initialsOf('   ')).toBe('');
  });
});
