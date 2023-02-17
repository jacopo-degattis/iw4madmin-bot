import { DynamicModule, Module } from "@nestjs/common";
import { Config } from "./iw4madmin.config";
import { CONFIG_OPTIONS } from "./iw4madmin.consts";
import { IW4MApiService } from "./iw4madmin.service";
import { HttpModule, HttpService } from "@nestjs/axios";

@Module({})
export class IW4MAdminModule {
  static register(config: Config): DynamicModule {
    return {
      module: IW4MAdminModule,
      imports: [HttpModule],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: config
        },
        IW4MApiService,
      ],
      global: (config?.isGlobal || false),
      exports: [IW4MApiService]
    }
  }
}
