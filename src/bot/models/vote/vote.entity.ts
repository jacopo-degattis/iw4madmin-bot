import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// Better yes or no ?
export enum VoteValue {
  UP = "UP",
  DOWN = "DOWN"
}

@Schema()
export class Vote {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  vote: VoteValue;

  // Id of the Poll that own this vote
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  belongTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll'
  }

  // Discord id of the user that made this vote
  @Prop({ required: true })
  from: string;
}

export type VoteDocument = Vote & Document;
export const VoteSchema = SchemaFactory.createForClass(Vote);
