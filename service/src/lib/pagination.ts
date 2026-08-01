import { z } from 'zod';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}


const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
})


export function parsePagination(rawPage: unknown, rawPageSize: unknown): PaginationParams {
  const { page, pageSize } = paginationSchema.parse({ page: rawPage, pageSize: rawPageSize });
  return { page, pageSize };
}

export function toPaginatedResult<T>(items: T[], total: number, { page, pageSize }: PaginationParams): PaginatedResult<T> {
  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize) || 1
  };
}
