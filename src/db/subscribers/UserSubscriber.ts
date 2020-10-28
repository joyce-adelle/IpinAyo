import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";

import { User } from "../entities/User";
import Auth from '../../utilities/Auth';
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.password = await Auth.hashPassword(event.entity.password);
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    if (event.entity.password !== event.databaseEntity.password)
      event.entity.password = await Auth.hashPassword(event.entity.password);
  }
}
