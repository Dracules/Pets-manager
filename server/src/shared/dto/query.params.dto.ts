import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

const SORT_ORDER = ['asc', 'desc'] as const;
export type SortOrder = (typeof SORT_ORDER)[number];

const SORT_COLUMNS = ['name', 'birthDate', 'litterStatus'] as const;
export type SortColumns = (typeof SORT_COLUMNS)[number];

export class QueryParamsDTO {
  /* Pagination params*/
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  /* Sorting params*/
  @IsOptional()
  @IsString()
  @IsEnum(SORT_COLUMNS)
  sortBy?: SortColumns;

  @IsOptional()
  @IsString()
  @IsEnum(SORT_ORDER)
  sortOrder?: SortOrder;
}
