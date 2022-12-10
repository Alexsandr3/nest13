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

  async updateDateDevice(userId: string, deviceId: string,
                         dateCreateToken: string, dateExpiredToken: string,
                         dateCreatedOldToken: string): Promise<boolean> {
    const result = await this.deviceModel.updateOne({
      $and: [
        { userId: { $eq: userId } },
        { deviceId: { $eq: deviceId } },
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

  async findDeviceForDelete(userId: string, deviceId: string, dateCreatedToken: string) {
    return this.deviceModel.findOne({
      $and: [
        { userId: { $eq: userId } },
        { deviceId: { $eq: deviceId } },
        { lastActiveDate: { $eq: dateCreatedToken } }
      ]
    });
  }

  async deleteDevice(userId: string, deviceId: string): Promise<boolean> {
    const result = await this.deviceModel.deleteOne({
      $and: [
        { userId: { $eq: userId } },
        { deviceId: { $eq: deviceId } }
      ]
    });
    return result.deletedCount === 1;
  }

  async deleteDevices(payload: PayloadType) {
    return this.deviceModel.deleteMany({ userId: payload.userId, deviceId: { $ne: payload.deviceId } });
  }

  async findByDeviceIdAndUserId(userId: string, deviceId: string) {
    return this.deviceModel.findOne({ userId, deviceId });
  }

  async deleteDeviceByDeviceId(deviceId: string) {
    return this.deviceModel.deleteMany({ deviceId: deviceId });
  }

  async findDeviceForValid(userId: string, deviceId: string, iat: number) {
    const dateCreateToken = (new Date(iat * 1000)).toISOString();
    const result = await this.deviceModel
      .findOne({
        $and: [
          { userId: userId },
          { deviceId: deviceId },
          { lastActiveDate: dateCreateToken }
        ]
      });
    if (!result) {
      return null;
    } else {
      return result;
    }
  }

  async findDeviceByDeviceId(deviceId: string) {
    const result = await this.deviceModel
      .findOne({deviceId: deviceId})
    console.log("result found", result);
    if (!result) {
      return null
    } else {
      return result
    }
  }
}
