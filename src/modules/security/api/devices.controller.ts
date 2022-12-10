import {
  Controller, Delete, Get, HttpCode, Param, UseGuards
} from "@nestjs/common";
import { DevicesService } from "../domain/devices.service";
import { DeviceQueryRepositories } from "../infrastructure/device-query.repositories";
import { IdValidationPipe } from "../../../helpers/IdValidationPipe";
import { RefreshGuard } from "../../auth/guard/jwt-refresh-Auth.guard";
import { DeviceViewModel } from "../infrastructure/device-View-Model";
import { PayloadRefresh } from "../../auth/decorators/payload-refresh.param.decorator";
import { PayloadType } from "../../auth/application/payloadType";
import { CurrentDevice } from "../../auth/decorators/current-device.param.decorator";
import { SkipThrottle } from "@nestjs/throttler";


@SkipThrottle()
@Controller(`security`)
export class DevicesController {
  constructor(protected devicesService: DevicesService,
              protected deviceQueryRepositories: DeviceQueryRepositories) {
  }


  @UseGuards(RefreshGuard)
  @Get(`/devices`)
  async findDevices(@CurrentDevice() userId: string): Promise<DeviceViewModel[]>{
    return await this.deviceQueryRepositories.findDevices(userId)
  }

  @UseGuards(RefreshGuard)
  @HttpCode(204)
  @Delete(`/devices`)
  async deleteDevices(@PayloadRefresh() payloadRefresh: PayloadType): Promise<boolean>{
    return await this.devicesService.deleteDevices(payloadRefresh)
  }

  @UseGuards(RefreshGuard)
  @HttpCode(204)
  @Delete(`/devices/:id`)
  async deleteByDeviceId(@PayloadRefresh() payloadRefresh: PayloadType,
                         @Param(`id`, IdValidationPipe) id: string): Promise<boolean>{
    const {deviceId, userId } = payloadRefresh
    return await this.devicesService.deleteByDeviceId(id, deviceId, userId )
  }

}
