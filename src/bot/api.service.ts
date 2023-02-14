import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { map } from "rxjs";

@Injectable()
export class IW4MApiService {
    
    private iw4Url: string;
    private serverId: string;

    private readonly logger = new Logger(IW4MApiService.name);

    constructor(
        private configService: ConfigService,
        private readonly httpService: HttpService
    ) {
        this.iw4Url = `http://${this.configService.get('SERVER_IP')}:${this.configService.get('IW4PORT')}`
        
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

    // TODO: cleanup after dev tests, to improve alot
    sendCommand(cmd: string, headers: any) {
        return this.httpService.post(`${this.iw4Url}/api/server/${this.serverId}/execute`, {
            "Command": cmd
        }, {
            headers: {
                'cookie': headers,
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
        }).pipe(map((data) => {
            console.log('[Command] ', data.status)
            console.log('[Command/Response]', data.data);
        }))
    }

    sendCommands(cmds: Array<string>): any {
        return this.httpService.post(`${this.iw4Url}/api/client/1/login`, {
            "password": "d5CR"
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },  
        }).pipe(
            map((value) => {
                console.log('[Token] ', value.status)
                console.log('[Token] ', value.data)
                return cmds.forEach((command) => {{
                    if (command.includes('map_rotate')) {
                        setTimeout(() => {
                            this.sendCommand(command, value.headers["set-cookie"]).subscribe();
                        }, 3000)
                    } else {
                        this.sendCommand(command, value.headers["set-cookie"]).subscribe();
                    }
                }
            })
        })).subscribe()
    }
}