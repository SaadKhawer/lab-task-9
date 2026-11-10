import type { INestApplication } from '@nestjs/common';
import { NotesService } from './notes/notes.service';
import { UsersService } from './users/users.service';

/**
 * Demo data, seeded once at startup (only what is missing is added,
 * so restarts are safe). Passwords follow the registration rule
 * (8+ characters, one uppercase, one number).
 *
 *   admin@lab09.dev / Admin1234     — role admin (for Task 6)
 *   ali@lab09.dev   / Ali12345      — normal user, owns 3 notes
 *   sara@lab09.dev  / Sara12345     — normal user, owns 1 note
 */
export async function seedDatabase(app: INestApplication) {
  const users = app.get(UsersService);
  const notes = app.get(NotesService);

  await users.seedIfMissing({
    name: 'Lab Admin',
    email: 'admin@lab09.dev',
    password: 'Admin1234',
    role: 'admin',
  });
  const ali = await users.seedIfMissing({
    name: 'Ali Ahmed',
    email: 'ali@lab09.dev',
    password: 'Ali12345',
  });
  const sara = await users.seedIfMissing({
    name: 'Sara Khan',
    email: 'sara@lab09.dev',
    password: 'Sara12345',
  });

  // Notes for the sorting demo (Task 4): titles out of order on purpose.
  const aliUser = ali ?? (await users.findByEmail('ali@lab09.dev'));
  const saraUser = sara ?? (await users.findByEmail('sara@lab09.dev'));
  if (aliUser) {
    await notes.seedIfMissing(aliUser.id, {
      title: 'Zebra notes',
      content: 'Last alphabetically.',
      tags: ['lab', 'sorting'],
    });
    await notes.seedIfMissing(aliUser.id, {
      title: 'Apple notes',
      content: 'First alphabetically.',
      tags: ['lab'],
    });
    await notes.seedIfMissing(aliUser.id, {
      title: 'Mango notes',
      content: 'In the middle.',
      tags: ['lab', 'fruit', 'demo'],
    });
  }
  if (saraUser) {
    await notes.seedIfMissing(saraUser.id, {
      title: 'Sara first note',
      content: 'Owned by Sara, for the 403 test.',
      tags: ['personal'],
    });
  }
}
