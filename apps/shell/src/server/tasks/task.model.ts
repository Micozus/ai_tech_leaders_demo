import type { Opt } from '@mikro-orm/core';

export interface TaskRecord {
  id: string;
  title: string;
  createdAt: Opt<Date>;
}
