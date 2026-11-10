import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { SortOrderPipe } from '../common/pipes/sort-order.pipe';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';
import type { Note } from './note.entity';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(req.user.sub, dto);
  }

  /** Task 4 — order is validated by SortOrderPipe (default asc). */
  @Get()
  findAll(
    @Req() req: any,
    @Query('order', SortOrderPipe) order: 'asc' | 'desc',
  ): Promise<Note[]> {
    return this.notesService.findAllByOwner(req.user.sub, order);
  }

  @Get(':id')
  findOne(@Param('id', PositiveIntPipe) id: number): Promise<Note> {
    return this.notesService.findOne(id);
  }

  /** Task 2 — PATCH /notes/:id, owner or admin only (else 403). */
  @Patch(':id')
  update(
    @Param('id', PositiveIntPipe) id: number,
    @Req() req: any,
    @Body() dto: UpdateNoteDto,
  ): Promise<Note> {
    return this.notesService.update(id, dto, req.user);
  }
}
