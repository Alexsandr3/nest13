import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LeanDocument, Model } from "mongoose";
import { Device, DeviceDocument } from "../domain/device-schema-Model";
import { DeviceViewModel } from "./device-View-Model";

@Injectable()
export class DeviceQueryRepositories {
  constructor(
    @InjectModel(Device.name) private readonly deviceModel: Model<DeviceDocument>) {
  }

  private deviceForView(object:  LeanDocument<DeviceDocument>): DeviceViewModel {
    return new DeviceViewModel(
      object.ip,
      object.title,
      object.lastActiveDate,
      object.deviceId
    )
  }


  async findDevices(userId: string): Promise<DeviceViewModel[]> {
    const result = await this.deviceModel
      .find({userId: userId}).lean()
    if (!result) {
     throw new Error('server all')
    } else {
      return  result.map(device => this.deviceForView(device))
    }
  }
}
