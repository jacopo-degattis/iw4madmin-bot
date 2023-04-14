import { Game } from './iw4madmin.enum'

export interface IW4MServer {
  id: number;
  hostname: string;
  ip: string;
  port: number;
  game: string;
  clientNum: number;
  maxClients: number;
  currentMap: IW4MMap;
  currentGameType: IW4MMGameType;
  parser: string;
}

export interface IW4MMGameType {
  type: string;
  name: string;
}

export interface IW4MMap {
  name: string;
  alias: string;
}
