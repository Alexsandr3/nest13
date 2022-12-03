export class PaginationViewType<T> {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: T,
  ) {}
}
