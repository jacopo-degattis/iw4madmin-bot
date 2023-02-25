import { InjectModel } from "@nestjs/mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { Model, UpdateWriteOpResult } from "mongoose";

import { PollService } from "../poll/poll.service";
import { VoteValue, Vote, VoteDocument } from "./vote.entity";

@Injectable()
export class VoteService {

  constructor(
    @InjectModel(Vote.name)
    private voteModel: Model<VoteDocument>,

    @Inject(PollService)
    private readonly pollService: PollService
  ) { }

  async create(vote: VoteValue, discordId: string, channelId: string): Promise<UpdateWriteOpResult> {
    let currentPoll = await this.pollService.get({ channelId: channelId })

    const newVote = await this.voteModel.create({
      vote: vote,
      from: discordId,
      belongTo: currentPoll._id
    })

    return await this.pollService.addVote(newVote);
  }

  async remove(from: string, channelId: string): Promise<UpdateWriteOpResult> {
    let currentPoll = await this.pollService.get({ channelId: channelId });

    await this.voteModel.deleteOne({
      from: from,
      belongTo: currentPoll._id
    })

    return await this.pollService.removeVote(from, currentPoll._id);
  }
}