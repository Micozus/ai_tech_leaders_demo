import { buildFormGroup, trimFormValue } from './form-group.helper';

describe('form-group helper', () => {
  const config = {
    submitLabel: 'Save',
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'note', label: 'Note', required: false },
    ],
  };

  it('builds a control per field and applies required validation', () => {
    const group = buildFormGroup(config);

    expect(Object.keys(group.controls)).toEqual(['title', 'note']);
    expect(group.valid).toBe(false);

    group.controls['title'].setValue('Hello');
    expect(group.valid).toBe(true);
  });

  it('trims every value', () => {
    expect(trimFormValue({ title: '  Hello ', note: '' })).toEqual({
      title: 'Hello',
      note: '',
    });
  });
});
