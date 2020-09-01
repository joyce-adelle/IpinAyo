import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";

import { Music } from "../entities/Music";

@EventSubscriber()
export class MusicSubscriber implements EntitySubscriberInterface<Music> {
  listenTo() {
    return Music;
  }

  beforeInsert(event: InsertEvent<Music>) {
    if (event.entity.isVerified) {
      event.entity.verifiedAt = new Date();
    }
  }

  beforeUpdate(event: UpdateEvent<Music>) {
    if (event.entity.isVerified && !event.databaseEntity.isVerified) {
      event.entity.verifiedAt = new Date();
    }
  }
}
