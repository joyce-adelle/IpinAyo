import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { RelatedPhrases } from "../entities/RelatedPhrases";

@EventSubscriber()
export class RelatedPhrasesSubscriber
  implements EntitySubscriberInterface<RelatedPhrases> {
  listenTo() {
    return RelatedPhrases;
  }

  async beforeInsert(event: InsertEvent<RelatedPhrases>) {
    if (!event.entity.groupId) {
      let maxGroupId: number;
      await event.manager
        .getRepository(RelatedPhrases)
        .query(
          "SELECT DISTINCT groupId FROM related_phrases WHERE groupId = ( SELECT MAX(groupId) FROM related_phrases )"
        )
        .then((maxId) => {
          maxGroupId = maxId[0] ? maxId[0].groupId : 0;
        });
      event.entity.groupId = String(++maxGroupId);
    }
  }
}
