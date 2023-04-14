import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Subscription, catchError, delay, forkJoin, map, tap } from "rxjs";

import { Config } from "./iw4madmin.config";
import { CONFIG_OPTIONS } from "./iw4madmin.consts";
import { IW4MServer } from "./iw4madmin.interface";
import { Game } from "./iw4madmin.enum";

@Injectable()
export class IW4MApiService {

  private iw4Url: string;
  private serverId: string;
  private _currentServer: { id: number; game: Game } = { id: 0, game: null };
  private _availableServers: Array<IW4MServer> = [];

  private readonly logger = new Logger(IW4MApiService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(CONFIG_OPTIONS) private readonly configService: Config,
  ) {
    this.iw4Url = `http://${this.configService.address}:${this.configService.port}`

    this._availableServers = this.fetchServers();

    if (this._availableServers.length > 0) {
      // Set the first server as default one
      const { id, game } = this._availableServers[0];

      this._currentServer = { id, game: game as Game };
    }
  }

  get availableServers() {
    return this._availableServers;
  }

  get currentServer() {
    return this._currentServer;
  }

  set currentServer(data: { id: number, game: Game }) {
    this.fetchServerById(data.id).subscribe((response) => {
      if (response.status !== 200) return;

      this._currentServer = response.data;
    })
  }

  private fetchServerById(id: number) {
    return this.httpService.get(`${this.iw4Url}/api/server/${id}`);
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

  fetchServers(): Array<IW4MServer> {
    const exampleResponse = [{ "id": 1270014981, "hostname": "BlackOpsPublic", "ip": "127.0.0.1", "port": 4981, "game": "T6", "clientNum": 0, "maxClients": 5, "currentMap": { "name": "zm_buried", "alias": "Buried/Resolution 1295" }, "currentGameType": { "type": "zclassic", "name": "zclassic" }, "parser": "Plutonium T6 Parser" }];
    return exampleResponse;
  }

  sendCommand(cmd: string, headers?: Array<string>) {
    return this.httpService.post(`${this.iw4Url}/api/server/${this.currentServer}/execute`, {
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
