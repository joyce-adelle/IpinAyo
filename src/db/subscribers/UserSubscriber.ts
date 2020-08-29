import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";

import { User } from "../entities/User";
import { createHmac } from "crypto";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>) {
    event.entity.password = createHmac("sha256", event.entity.password).digest(
      "hex"
    );
  }

  beforeUpdate(event: UpdateEvent<User>) {
    if (event.entity.password !== event.databaseEntity.password) {
      event.entity.password = createHmac(
        "sha256",
        event.entity.password
      ).digest("hex");
    }
  }
}
