import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Trim } from "../../../../helpers/decorator-trim";
import { Transform } from "class-transformer";

export enum SortDirectionType {
  Asc = "asc",
  Desc = "desc",
}

export enum BanStatusType {
  all = "all",
  banned = "banned",
  notBanned = "notBanned",
}

export class PaginationUsersDto {
  /**
   * banStatus by parameters
   */
  @IsString()
  @IsEnum(BanStatusType)
  @IsOptional()
  banStatus: BanStatusType = BanStatusType.all;
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
  @Trim()
  @IsString()
  @IsOptional()
  sortBy = "createdAt";
  /**
   * Sort by desc or asc
   */
  @Trim()
  @IsEnum(SortDirectionType)
  @IsOptional()
  sortDirection: SortDirectionType = SortDirectionType.Desc;
  /**
   * Search term for user Login: Login should contain this term in any position
   */
  @IsString()
  @IsOptional()
  searchLoginTerm = "";
  /**
   *  Search term for user Email: Email should contains this term in any position
   */
  @IsString()
  @IsOptional()
  searchEmailTerm = "";
}
