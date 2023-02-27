import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
          dbName: process.env.MONGO_DB_NAME,
          user: process.env.MONGO_USER,
          pass: process.env.MONGO_PASSWORD
        }
      }

    })
  ]
})
export class MongoModule { }