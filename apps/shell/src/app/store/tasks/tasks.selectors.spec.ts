import { selectTasksVm } from './tasks.selectors';

describe('selectTasksVm', () => {
  it('flags an empty list only when not loading', () => {
    const state = (
      tasks: { id: string; title: string }[],
      loading: boolean,
    ) => ({
      tasks: { tasks, loading },
    });

    expect(selectTasksVm(state([], false)).isEmpty).toBe(true);
    expect(selectTasksVm(state([], true)).isEmpty).toBe(false);
    expect(selectTasksVm(state([{ id: '1', title: 'A' }], false)).isEmpty).toBe(
      false,
    );
  });
});
