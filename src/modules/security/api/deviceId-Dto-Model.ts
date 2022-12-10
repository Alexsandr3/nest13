import { IsUUID } from "class-validator";

export class DeviceIdDto {
  @IsUUID()
  deviceId: string;
}