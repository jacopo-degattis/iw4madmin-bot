import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { PollService } from "./poll.service";
import { Poll, PollSchema } from "./poll.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Poll.name, schema: PollSchema }
    ])
  ],
  controllers: [],
  providers: [PollService],
  exports: [PollService]
})
export class PollModule { }