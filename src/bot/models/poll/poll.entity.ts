import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Vote } from "../vote/vote.entity";

@Schema({ timestamps: true })
export class Poll {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  channelId: string;

  // This property will always have the name of the chosen map
  @Prop({ required: true })
  pollName: string;

  // This property will always have the gamemode that has been chosen
  @Prop({ required: true })
  gamemode: string;

  @Prop({ required: true })
  votes: Array<Vote>

}

export type PollDocument = Poll & Document;
export const PollSchema = SchemaFactory.createForClass(Poll);

// Remove all entries in collection after 'expireAfterSeconds'
// In this case after 2 hours
PollSchema.index({ createAt: 1 }, { expireAfterSeconds: 7200 })
