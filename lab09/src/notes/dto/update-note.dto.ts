import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';

/** Task 2 — every field of CreateNoteDto becomes optional for updates. */
export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
