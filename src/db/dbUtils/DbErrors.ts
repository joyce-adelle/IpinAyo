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
  constructor(idOrPhrase: string) {
    const message = `Related Phrase ${idOrPhrase} did not retrieve a Related Phrase`;
    super(message);
  }
}

export class CategoryNotRetrieved extends MyDbError {
  constructor(id: string) {
    const message = `Category id ${id} did not retrieve a Category`;
    super(message);
  }
}
