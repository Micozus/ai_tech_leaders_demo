import { parseCreateTaskBody } from './tasks.helper';

describe('parseCreateTaskBody', () => {
  it('returns the trimmed title', () => {
    expect(parseCreateTaskBody({ title: '  Write docs ' })).toBe('Write docs');
  });

  it.each([
    null,
    'x',
    {},
    { title: 1 },
    { title: '   ' },
    { title: 'a'.repeat(201) },
  ])('rejects %j', (body) => {
    expect(parseCreateTaskBody(body)).toBeNull();
  });
});
