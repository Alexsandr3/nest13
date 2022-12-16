import { IsString } from 'class-validator';

export class DeviceIdDto {
  //@Transform(({ value }) => value.trim())
  @IsString()
  deviceId: string;
}
