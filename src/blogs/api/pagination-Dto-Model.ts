import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum SortDirectionType {
  Asc = 'asc',
  Desc = 'desc',
}

export class PaginationDto {
  /**
   *  Search term for blog Name: Name should contain this term in any position
   */
  @IsString()
  @IsOptional()
  searchNameTerm: string = null;
  /**
   *  pageNumber is number of portions that should be returned
   */
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  pageNumber = 1;
  /**
   * pageSize is portions size that should be returned
   */
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  pageSize = 10;
  /**
   * Sort by parameters
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  sortBy = 'createdAt';
  /**
   * Sort by desc or asc
   */
  @Transform(({ value }) => value.trim())
  @IsEnum(SortDirectionType)
  @IsOptional()
  sortDirection: SortDirectionType = SortDirectionType.Desc;
}
