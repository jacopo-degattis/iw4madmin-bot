import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Poll, PollSchema } from "./poll.entity";
import { PollService } from "./poll.service";

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