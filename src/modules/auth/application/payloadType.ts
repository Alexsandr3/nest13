export class PayloadType {
  constructor(public userId: string,
              public deviceId: string,
              public login: string,
              public iat: number,
              public exp: number) {
  }
}
