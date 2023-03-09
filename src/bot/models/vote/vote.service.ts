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

  async hasVoted(channelId: string, discordId: string): Promise<boolean> {
    const got = await this.voteModel.findOne({
      from: discordId,
    })

    return got ? true : false;
  }

  async remove(from: string, channelId: string): Promise<UpdateWriteOpResult> {
    let currentPoll = await this.pollService.get({ channelId: channelId });

    await this.voteModel.deleteOne({
      from: from,
      belongTo: currentPoll._id
    })

    return await this.pollService.removeVote(from, currentPoll._id);
  }

  async edit(from: string, channelId: string, newVote: string): Promise<UpdateWriteOpResult> {
    const currentPoll = await this.pollService.get({ channelId: channelId });

    return await this.voteModel.updateOne({
      from: from,
      belongTo: currentPoll._id
    }, {
      vote: newVote
    });
  }
}