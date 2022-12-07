import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesService } from "./domain/devices.service";
import { DeviceRepositories } from "./infrastructure/device-repositories";
import { DevicesController } from "./api/devices.controller";
import { Device, DeviceSchema } from "./domain/device-schema-Model";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService, DeviceRepositories],
  //exports: [DeviceRepositories]
})
export class DeviceModule {}
