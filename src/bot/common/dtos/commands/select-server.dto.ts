import { Param } from "@discord-nestjs/core";
import { Transform } from "class-transformer";

export class SelectServerDto {

  @Transform(({ value }) => value.toLowerCase())
  @Param({
    name: 'server',
    description: 'Set the server you want to operate onto',
    required: true,
    autocomplete: true
  })
  server: string;

}