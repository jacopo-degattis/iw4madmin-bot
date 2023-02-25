import { VoteValue } from "src/bot/models/vote/vote.entity";

export class VoteDto {
  vote: VoteValue;
  belongTo: string;
  from: string;
}
