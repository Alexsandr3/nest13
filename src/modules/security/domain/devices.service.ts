import { Injectable } from "@nestjs/common";
import { PayloadType } from "../../auth/application/payloadType";
import { DeviceRepositories } from "../infrastructure/device-repositories";
import { ForbiddenExceptionMY } from "../../../helpers/My-HttpExceptionFilter";

@Injectable()
export class DevicesService {
  constructor(protected  deviceRepositories: DeviceRepositories) {
  }

  async findDevices() {
    return Promise.resolve(undefined);
  }

  async deleteDevices(payload: PayloadType): Promise<boolean> {
    await this.deviceRepositories.deleteDevices(payload)
    return true
  }

  async deleteByDeviceId(deviceIdForDelete: string, deviceId: string, userId: string): Promise<boolean> {
    const isUserDevice = await this.deviceRepositories.findByDeviceIdAndUserId(userId, deviceId)
    if (!isUserDevice) throw new ForbiddenExceptionMY(`You are not the owner of the device `)
    const deviceForDelete = await this.deviceRepositories.findByDeviceIdAndUserId(userId, deviceIdForDelete)
    if (!deviceForDelete) throw new ForbiddenExceptionMY(`You are not the owner of the device`)
    const isDelete = await this.deviceRepositories.deleteDeviceByDeviceId(deviceIdForDelete)
    if (!isDelete) throw new ForbiddenExceptionMY(`You are not the owner of the device`)
    return true
  }
}
