import { ScoreType } from "../../utilities/ScoreType";

export interface UpdateMusic {
  title?: string;
  description?: string;
  scoreType?: ScoreType;
  languages?: string[];
  relatedPhrasesIds?: string[];
  categoryIds?: string[];
  audio?: string;
  composers?: string;
  yearOfComposition?: string;
  arrangers?: string;
  yearOfArrangement?: string;
  isVerified?: boolean;
}
