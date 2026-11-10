import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Task 4 — validates the ?order= query value.
 * Accepted values are asc and desc (case-insensitive), returned lower-case.
 * Missing value -> asc. Anything else -> 400 "order must be asc or desc".
 */
@Injectable()
export class SortOrderPipe implements PipeTransform {
  transform(value: unknown): 'asc' | 'desc' {
    if (value === undefined || value === null || value === '') {
      return 'asc';
    }
    const order = String(value).toLowerCase();
    if (order === 'asc' || order === 'desc') {
      return order;
    }
    throw new BadRequestException('order must be asc or desc');
  }
}
