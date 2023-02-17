import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Subscription, catchError, delay, forkJoin, map } from "rxjs";
import { CONFIG_OPTIONS } from "./iw4madmin.consts";
import { Config } from "./iw4madmin.config";

@Injectable()
export class IW4MApiService {

  private iw4Url: string;
  private serverId: string;

  private readonly logger = new Logger(IW4MApiService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(CONFIG_OPTIONS) private readonly configService: Config
  ) {
    this.iw4Url = `http://${this.configService.address}:${this.configService.port}`

    this.fetchServerId().subscribe(response => {
      if (!(response.status === 200)) {
        this.logger.error('Error while fetching server info');
      }
      this.serverId = response.data[0].id;
    })
  }

  private fetchServerId() {
    return this.httpService.get(`${this.iw4Url}/api/server`)
  }

  // This function log the user in and just returns the cookies
  // Associated with the login session
  login(username: string, password: string) {
    return this.httpService.post(`${this.iw4Url}/api/client/${username}/login`, {
      "password": password
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).pipe(
      map((response) => {
        return response.headers["set-cookie"]
      })
    )
  }

  sendCommand(cmd: string, headers?: Array<string>) {
    return this.httpService.post(`${this.iw4Url}/api/server/${this.serverId}/execute`, {
      "Command": cmd
    }, {
      headers: {
        'cookie': headers || '',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).pipe(
      // Default delay for each command
      delay(3000),

      // TODO: add only if dev mode is on
      map((data) => {
        console.log('[Command] ', data.status)
        console.log('[Command/Response]', data.data);
      }),

      catchError((err) => `[ERR]: ${err}`),
    )
  }

  sendCommands(cmds: Array<string>): Subscription {
    if (this.configService.env === 'dev') {
      return this.login('1', 'o2Zp').pipe(
        map(headers => {
          return forkJoin(
            cmds.map(command => {
              return this.sendCommand(command, headers);
            }
            )).subscribe()
        })
      ).subscribe()
    }

    return forkJoin(
      cmds.map(command => this.sendCommand(command))
    ).subscribe()
  }
}
