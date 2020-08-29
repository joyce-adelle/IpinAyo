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

  afterInsert(event: InsertEvent<Music>) {
    if (event.entity.isVerified) {
      event.manager
        .createQueryBuilder()
        .update(Music)
        .set({ verifiedAt: () => `CURRENT_TIMESTAMP(6)` })
        .where("id = :id", { id: event.entity.id })
        .execute();
    }
  }

  afterUpdate(event: InsertEvent<Music>) {
    if (event.entity.isVerified) {
      event.manager
        .createQueryBuilder()
        .update(Music)
        .set({ verifiedAt: () => `CURRENT_TIMESTAMP(6)` })
        .where("id = :id", { id: event.entity.id })
        .execute();
    }
  }


  beforeInsert(event: InsertEvent<Music>) {
    if (event.entity.isVerified) {
      event.entity.verifiedAt = new Date();
    }
  }

  beforeUpdate(event: UpdateEvent<Music>) {
    if (event.entity.isVerified) {
      event.entity.verifiedAt = new Date();
    }
  }
}
