import { MikroORM } from '@mikro-orm/postgresql';
import { TaskEntity } from '../tasks/task.entity';
import { createOrm, ensureSchema } from './database';
import { DEFAULT_DATABASE_URL, SEED_TASK_TITLES } from './database.model';

vi.mock('@mikro-orm/postgresql', () => ({ MikroORM: vi.fn() }));

describe('database', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  describe('createOrm', () => {
    it('connects to DATABASE_URL when set', () => {
      vi.stubEnv('DATABASE_URL', 'postgres://example/db');

      createOrm();

      expect(MikroORM).toHaveBeenCalledWith(
        expect.objectContaining({
          clientUrl: 'postgres://example/db',
          entities: [TaskEntity],
        }),
      );
    });

    it('falls back to the default URL', () => {
      vi.stubEnv('DATABASE_URL', undefined);

      createOrm();

      expect(MikroORM).toHaveBeenCalledWith(
        expect.objectContaining({ clientUrl: DEFAULT_DATABASE_URL }),
      );
    });
  });

  describe('ensureSchema', () => {
    function createFakeOrm(existingTasks: number) {
      const em = {
        count: vi.fn().mockResolvedValue(existingTasks),
        create: vi.fn(),
        flush: vi.fn().mockResolvedValue(undefined),
      };
      const update = vi.fn().mockResolvedValue(undefined);
      const orm = {
        schema: { update },
        em: { fork: () => em },
      } as unknown as MikroORM;
      return { orm, em, update };
    }

    it('updates the schema and seeds an empty table', async () => {
      const { orm, em, update } = createFakeOrm(0);

      await ensureSchema(orm);

      expect(update).toHaveBeenCalled();
      expect(em.create.mock.calls).toEqual(
        SEED_TASK_TITLES.map((title) => [TaskEntity, { title }]),
      );
      expect(em.flush).toHaveBeenCalled();
    });

    it('keeps existing data untouched', async () => {
      const { orm, em, update } = createFakeOrm(3);

      await ensureSchema(orm);

      expect(update).toHaveBeenCalled();
      expect(em.create).not.toHaveBeenCalled();
      expect(em.flush).not.toHaveBeenCalled();
    });
  });
});
