import { ScoreType } from "../../utilities/ScoreType";

export interface CreateMusic {
  scorePath: string;
  scoreFilename: string,
  title: string;
  description: string;
  scoreType: ScoreType;
  languages: string[];
  relatedPhrasesIds: string[];
  categoryIds: string[];
  uploadedById: string;
  audioPath?: string;
  audioFilename?: string,
  composers?: string;
  yearOfComposition?: string;
  arrangers?: string;
  yearOfArrangement?: string;
}
