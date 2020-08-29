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
      let maxId = await event.manager
        .getRepository(RelatedPhrases)
        .query(
          "SELECT groupId FROM related_phrases WHERE groupId = ( SELECT MAX(groupId) FROM related_phrases )"
        );
      event.entity.groupId = String(<number>maxId + 1);
    }
  }
}
