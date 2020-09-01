import { ScoreType } from "../utilities/ScoreType";

export interface UpdateMusic {
  score?: string;
  title?: string;
  description?: string;
  scoreType?: ScoreType;
  languages?: string[];
  relatedPhrasesIds?: string[];
  categoryIds?: string[];
  isVerified?: boolean;
  audio?: string;
  composers?: string;
  yearOfComposition?: string;
  arrangers?: string;
  yearOfArrangement?: string;
  verifiedById?: string;
  updatedById?: string;
}
