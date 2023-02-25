import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { VoteService } from "./vote.service";
import { PollModule } from "../poll/poll.module";
import { Vote, VoteSchema } from "./vote.entity";

@Module({
  imports: [
    PollModule,
    MongooseModule.forFeature([
      { name: Vote.name, schema: VoteSchema }
    ])
  ],
  controllers: [],
  providers: [VoteService],
  exports: [VoteService]
})
export class VoteModule { }