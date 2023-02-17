import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Poll, PollDocument } from "./poll.entity";
import { Model, UpdateWriteOpResult } from "mongoose";
import { PollDto } from "src/bot/common/dtos/models/poll.dto";
import { VoteValue } from "../vote/vote.entity";

@Injectable()
export class PollService {

  constructor(
    @InjectModel(Poll.name)
    private pollModel: Model<PollDocument>,
  ) { }

  async create(pollData: PollDto): Promise<Poll> {
    // TODO: Add support for multiple polls at the same time ?
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

  async hasVoted(discordId: string): Promise<any> {
    const found = await this.pollModel.find({
      "votes.from": discordId
    }).exec()
    return found.length === 1
  }

  // Add a new vote inside the Poll entry with _id equale to 'vote.belongTo'
  async addVote(vote: any): Promise<UpdateWriteOpResult> {
    return await this.pollModel.updateOne({ _id: vote.belongTo }, {
      $push: { votes: vote },
    });
  }

  // Returns the percentage of upvotes that the poll has received
  // TODO: improve this function maybe with filter
  async getUpVotesPercentage(channelId: string, membersNumber: number): Promise<number> {
    const currentPoll = await this.get({ channelId: channelId });

    const result = { UP_VOTES: 0, DOWN_VOTES: 0 };

    currentPoll.votes.forEach((vote) => {
      if (vote.vote.toUpperCase() === VoteValue.UP) {
        result.UP_VOTES++;
      } else if (vote.vote.toUpperCase() === VoteValue.DOWN) {
        result.DOWN_VOTES++;
      }
    })

    return parseInt((result.UP_VOTES * 100 / membersNumber).toFixed());
  }
}
