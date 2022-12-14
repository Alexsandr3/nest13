export class BlogViewModel {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
  ) {}
}



export class BlogViewForSaModel {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public blogOwnerInfo:BlogOwnerInfoType
  ) {}
}


export class BlogOwnerInfoType {
  constructor(public userId: string,
              public userLogin: string) {
  }
}