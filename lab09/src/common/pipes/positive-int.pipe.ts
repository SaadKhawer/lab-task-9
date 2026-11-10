import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Validates route ids such as /notes/:id.
 * Accepts only positive integers (1, 2, 3, ...). Anything else -> 400.
 */
@Injectable()
export class PositiveIntPipe implements PipeTransform {
  transform(value: unknown): number {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) {
      throw new BadRequestException('id must be a positive integer');
    }
    return n;
  }
}
