export class PreparationUserBanInfoForDB {
  constructor(
    public userId: string,
    public isBanned: boolean,
    public banDate: string,
    public banReason: string,
  ) {}
}
