import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId, UpdateWriteOpResult } from "mongoose";

import { VoteValue } from "../vote/vote.entity";
import { Poll, PollDocument } from "./poll.entity";
import { PollDto } from "src/bot/common/dtos/models/poll.dto";

@Injectable()
export class PollService {

  constructor(
    @InjectModel(Poll.name)
    private pollModel: Model<PollDocument>,
  ) { }

  async create(pollData: PollDto): Promise<Poll> {
    return await this.pollModel.create(pollData);
  }

  async createAndReplace(pollData: PollDto): Promise<Poll> {
    let currentPoll = await this.pollModel.findOne({ channelId: pollData.channelId })

    // Delete the current Poll if it exists
    if (currentPoll) await currentPoll.delete();

    return this.create(pollData);
  }

  async get(pollData: { _id?: string, channelId?: string, pollName?: string }): Promise<Poll> {
    return await this.pollModel.findOne(pollData);
  }

  async getPollMap(channelId: string): Promise<string> {
    return (await this.get({ channelId })).pollName;
  }

  // Check if a poll for this map already exists for this channelId
  async exists(channelId: string, mapName: string, gamemode: string): Promise<boolean> {
    return !!(await this.pollModel.findOne({ channelId: channelId, pollName: mapName, gamemode: gamemode }));
  }

  // Check whether a user with discordId has already voted or not

  // Add a new vote inside the Poll entry with _id equal to 'vote.belongTo'
  async addVote(vote: any): Promise<UpdateWriteOpResult> {
    return await this.pollModel.updateOne({ _id: vote.belongTo }, {
      $push: { votes: vote },
    });
  }

  async removeVote(from: string, pollId: ObjectId): Promise<UpdateWriteOpResult> {
    return await this.pollModel.updateOne({ _id: pollId }, {
      $pull: {
        votes: { from: from }
      }
    })
  }

  // Returns the percentage of upvotes that the poll has received
  async getUpVotesPercentage(channelId: string, membersNumber: number): Promise<number> {
    const currentPoll = await this.get({ channelId: channelId });

    const upVotesCount = currentPoll.votes
      .filter(vote => vote.vote === VoteValue.UP).length;

    return parseInt((upVotesCount * 100 / membersNumber).toFixed());
  }
}
