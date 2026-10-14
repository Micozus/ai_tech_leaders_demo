import { tasksTransferKey } from './tasks-transfer.helper';

describe('tasksTransferKey', () => {
  it('creates a TransferState key with the given name', () => {
    expect(String(tasksTransferKey('tasks:list'))).toBe('tasks:list');
  });
});
