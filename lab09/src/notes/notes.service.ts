import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Note } from './note.entity';
import type { CreateNoteDto } from './dto/create-note.dto';
import type { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  // In-memory store, same style as Lab 08 (no database in this lab).
  private notes: Note[] = [];
  private nextId = 1;

  async create(ownerId: number, dto: CreateNoteDto): Promise<Note> {
    const note: Note = {
      id: this.nextId++,
      title: dto.title,
      content: dto.content ?? '',
      tags: dto.tags ?? [],
      ownerId,
      createdAt: new Date().toISOString(),
    };
    this.notes.push(note);
    return note;
  }

  /** Task 4 — the user's own notes, sorted by title in the given order. */
  async findAllByOwner(
    ownerId: number,
    order: 'asc' | 'desc',
  ): Promise<Note[]> {
    const mine = this.notes.filter((n) => n.ownerId === ownerId);
    const sorted = [...mine].sort((a, b) =>
      a.title.localeCompare(b.title),
    );
    return order === 'desc' ? sorted.reverse() : sorted;
  }

  async findOne(id: number): Promise<Note> {
    const note = this.notes.find((n) => n.id === id);
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  /**
   * Task 2 — update. Only the owner or an admin may update,
   * otherwise 403. Only the fields sent in the body change.
   */
  async update(
    id: number,
    dto: UpdateNoteDto,
    user: { sub: number; role: string },
  ): Promise<Note> {
    const note = await this.findOne(id);
    if (note.ownerId !== user.sub && user.role !== 'admin') {
      throw new ForbiddenException('Only the owner or an admin can update this note');
    }
    if (dto.title !== undefined) note.title = dto.title;
    if (dto.content !== undefined) note.content = dto.content;
    if (dto.tags !== undefined) note.tags = dto.tags;
    return note;
  }

  /** Seed helper: creates a note only when the owner has none with this title. */
  async seedIfMissing(ownerId: number, dto: CreateNoteDto): Promise<void> {
    const exists = this.notes.some(
      (n) => n.ownerId === ownerId && n.title === dto.title,
    );
    if (!exists) await this.create(ownerId, dto);
  }
}
