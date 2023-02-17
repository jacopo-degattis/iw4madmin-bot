import { VoteDto } from "./vote.dto";

export class PollDto {
  channelId: string;
  pollName: string;
  gamemode: string;
  votes: Array<VoteDto>
}