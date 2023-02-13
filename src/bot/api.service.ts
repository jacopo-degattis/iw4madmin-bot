import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

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
            this.serverId = response.data.id;
        })
    }

    private fetchServerId() {
        return this.httpService.get(`${this.iw4Url}/api/server`)
    }

    sendCommand(cmd: string) {
        return this.httpService.post(`${this.iw4Url}/api/server/${this.serverId}/execute`, {
            "Command": cmd
        })
    }
}