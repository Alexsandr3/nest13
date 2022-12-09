import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesService } from "./domain/devices.service";
import { DeviceRepositories } from "./infrastructure/device-repositories";
import { DevicesController } from "./api/devices.controller";
import { Device, DeviceSchema } from "./domain/device-schema-Model";
import { DeviceQueryRepositories } from "./infrastructure/device-query.repositories";
import { JwtService } from "../auth/application/jwt.service";
import { RefreshGuard } from "../auth/guard/jwt-refresh-Auth.guard";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService, DeviceRepositories, DeviceQueryRepositories, RefreshGuard, JwtService],
  //exports: [DeviceRepositories]
})
export class DeviceModule {}
