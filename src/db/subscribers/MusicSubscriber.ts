import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from "typeorm";

import { Music } from "../entities/Music";
import * as fs from "fs";

@EventSubscriber()
export class MusicSubscriber implements EntitySubscriberInterface<Music> {
  listenTo() {
    return Music;
  }

  beforeInsert(event: InsertEvent<Music>) {
    if (event.entity.isVerified) {
      event.entity.verifiedAt = new Date();
    }
    // var oldpath = event.entity.scoreFile.name;
    //   var newpath = __dirname + event.entity.scoreFile.name;
    //   fs.rename(oldpath, newpath, function (err) {
    //     if (err) throw err;
    //     console.log('File uploaded and moved!');
    //   });
  }

  beforeUpdate(event: UpdateEvent<Music>) {
    if (event.entity.isVerified && !event.databaseEntity.isVerified) {
      event.entity.verifiedAt = new Date();
    }
  }
    
}
