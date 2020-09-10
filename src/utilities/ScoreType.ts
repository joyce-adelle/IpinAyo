import { registerEnumType } from 'type-graphql';

export enum ScoreType {
  Full = "full",
  Miniature = "miniature",
  Study = "study",
  Piano = "piano",
  Vocal = "vocal",
  Choral = "choral",
  Organ = "organ",
  Short = "short",
  Open = "open",
  LeadSheet = " lead sheet",
  ChordChart = "chord chart",
  Tablature = "tablature",
  LeadSheetAndAccompaniment = " lead sheet and accompaniment",
}

registerEnumType(ScoreType, {
  name: "ScoreType",
  description: "type of music score",
});