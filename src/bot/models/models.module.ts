import { Module } from "@nestjs/common";

import { PollModule } from "./poll/poll.module";
import { VoteModule } from "./vote/vote.module";

@Module({
  imports: [PollModule, VoteModule],
  providers: [],
  exports: [PollModule, VoteModule]
})
export class ModelsModule { }