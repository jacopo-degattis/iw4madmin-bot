import { Param } from "@discord-nestjs/core";
import { Transform } from "class-transformer";
import { VoteValue } from "src/bot/models/vote/vote.entity";

export class VoteDto {
  vote: VoteValue;
  belongTo: string;
  from: string;
}

export class VoteCommandDto {

  @Transform(({ value }) => value.toLowerCase())
  @Param({
    name: 'vote',
    description: 'Give a vote',
    required: true,
    autocomplete: true // TODO:
  })
  votez: VoteValue;
}
