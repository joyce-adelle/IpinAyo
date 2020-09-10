import { registerEnumType } from 'type-graphql';

export enum CompositionType {
  Sacred = "sacred",
  Secular = "secular",
}

registerEnumType(CompositionType, {
  name: "CompositionType",
  description: "type of compositions written by user",
});