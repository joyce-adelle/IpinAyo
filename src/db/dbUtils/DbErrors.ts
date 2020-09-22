import { MyDbError } from "./MyDbError";

export class UserNotRetrieved extends MyDbError {
  constructor(id: string) {
    const message = `User id ${id} did not retrieve a User`;
    super(message);
  }
}

export class MusicNotRetrieved extends MyDbError {
  constructor(id: string) {
    const message = `Music id ${id} did not retrieve a Music`;
    super(message);
  }
}

export class RelatedPhraseNotRetrieved extends MyDbError {
  constructor(id?: string, phrase?: string) {
    let message: string;
    if (id) {
      message = `Related Phrase id ${id} did not retrieve a Related Phrase`;
    }
    message = `Related Phrase phrase ${phrase} did not retrieve a Related Phrase`;
    super(message);
  }
}

export class CategoryNotRetrieved extends MyDbError {
  constructor(id: string) {
    const message = `Category id ${id} did not retrieve a Category`;
    super(message);
  }
}
