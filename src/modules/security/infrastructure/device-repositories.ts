import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Device, DeviceDocument } from "../domain/device-schema-Model";
import { PreparationDeviceForDB } from "../domain/device-preparation-for-DB";
import { PayloadType } from "../../auth/application/payloadType";

@Injectable()
export class DeviceRepositories {
  constructor(
    @InjectModel(Device.name) private readonly deviceModel: Model<DeviceDocument>) {
  }

  async createDevice(device: PreparationDeviceForDB) {
    return await this.deviceModel.create(device);
  }

  async updateDateDevice(payload: PayloadType, oldIat: number): Promise<boolean> {
    const dateCreatedOldToken = (new Date(oldIat * 1000)).toISOString();
    const dateCreateToken = (new Date(payload.iat * 1000)).toISOString();
    const dateExpiredToken = (new Date(payload.exp * 1000)).toISOString();
    const result = await this.deviceModel.updateOne({
      $and: [
        { userId: { $eq: payload.userId } },
        { deviceId: { $eq: payload.deviceId } },
        { lastActiveDate: { $eq: dateCreatedOldToken } }
      ]
    }, {
      $set: {
        lastActiveDate: dateCreateToken,
        expiredDate: dateExpiredToken
      }
    });
    return result.modifiedCount === 1;
  }

  async findDeviceForDelete(payload: PayloadType) {
    const dateCreatedToken = (new Date(payload.iat * 1000)).toISOString();
    return  this.deviceModel.findOne({
        $and: [
          { userId: { $eq: payload.userId } },
          { deviceId: { $eq: payload.deviceId } },
          { lastActiveDate: { $eq: dateCreatedToken } }
        ]
      });
  }

  async deleteDevice(payload: PayloadType): Promise<boolean> {
    const result = await this.deviceModel.deleteOne({
      $and: [
        {userId: {$eq: payload.userId}},
        {deviceId: {$eq: payload.deviceId}},
      ]
    })
    return result.deletedCount === 1
  }
}
