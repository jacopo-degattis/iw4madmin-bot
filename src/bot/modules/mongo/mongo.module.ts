import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          // TODO: make them configurable in .env file
          // migrate to .yaml file instead of .env one ?
          uri: 'mongodb://127.0.0.1:27017',
          dbName: 'iw4',
          user: 'admin',
          pass: 'admin'
        }
      }

    })
  ]
})
export class MongoModule { }