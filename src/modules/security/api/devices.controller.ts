import {
  Controller, Delete, Get, HttpCode, Param, UseGuards
} from "@nestjs/common";
import { DevicesService } from "../domain/devices.service";
import { DeviceQueryRepositories } from "../infrastructure/query-repository/device-query.repositories";
import { RefreshGuard } from "../../../guards/jwt-auth-refresh.guard";
import { DeviceViewModel } from "../infrastructure/query-repository/device-View-Model";
import { PayloadRefresh } from "../../../decorators/payload-refresh.param.decorator";
import { PayloadType } from "../../auth/application/payloadType";
import { CurrentUserIdDevice } from "../../../decorators/current-device.param.decorator";
import { SkipThrottle } from "@nestjs/throttler";


@SkipThrottle()
@Controller(`security`)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService,
              private readonly deviceQueryRepositories: DeviceQueryRepositories) {
  }


  @UseGuards(RefreshGuard)
  @Get(`/devices`)
  async findDevices(@CurrentUserIdDevice() userId: string): Promise<DeviceViewModel[]> {
    return await this.deviceQueryRepositories.findDevices(userId);
  }

  @UseGuards(RefreshGuard)
  @HttpCode(204)
  @Delete(`/devices`)
  async deleteDevices(@PayloadRefresh() payloadRefresh: PayloadType): Promise<boolean> {
    return await this.devicesService.deleteDevices(payloadRefresh);
  }

  @UseGuards(RefreshGuard)
  @HttpCode(204)
  @Delete(`/devices/:id`)
  async deleteByDeviceId(@PayloadRefresh() payloadRefresh: PayloadType,
                         @Param(`id`) id: string): Promise<boolean> {
    const { deviceId, userId } = payloadRefresh;
    return await this.devicesService.deleteByDeviceId(id, deviceId, userId);
  }

}
