export interface Task {
  id: string;
  title: string;
}

export const SEED_TASKS: readonly Task[] = [
  { id: 'seed-1', title: 'Read AGENTS.md' },
  { id: 'seed-2', title: 'Add your first feature' },
];
