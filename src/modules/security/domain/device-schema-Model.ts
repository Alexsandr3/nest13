import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  ip: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  lastActiveDate: string;
  @Prop({ type: String, required: true })
  expiredDate: string;
  @Prop({ type: String, required: true })
  deviceId: string;

  constructor(userId: string,
              ip: string,
              title: string,
              lastActiveDate: string,
              expiredDate: string,
              deviceId: string) {
    this.userId = userId;
    this.ip = ip;
    this.title = title;
    this.lastActiveDate = lastActiveDate;
    this.expiredDate = expiredDate;
    this.deviceId = deviceId;
  }

  static createDevice(userId: string, ip: string, title: string, lastActiveDate: string, expiredDate: string, deviceId: string) {
    return new Device(userId, ip, title, lastActiveDate, expiredDate, deviceId);
  }

  updateDateDevice(dateCreateToken: string, dateExpiredToken: string) {
    this.lastActiveDate = dateCreateToken;
    this.expiredDate = dateExpiredToken;
  }

}

export const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.methods = {
  updateDateDevice: Device.prototype.updateDateDevice
};