import { ScoreType } from "../../utilities/ScoreType";

export interface UpdateMusic {
  score?: string;
  title?: string;
  description?: string;
  scoreType?: ScoreType;
  languages?: string[];
  addRelatedPhrasesIds?: string[];
  removeRelatedPhrasesIds?: string[];
  addCategoryIds?: string[];
  removeCategoryIds?: string[];
  audio?: string;
  composers?: string;
  yearOfComposition?: string;
  arrangers?: string;
  yearOfArrangement?: string;
  isVerified?: boolean;
}
