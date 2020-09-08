import { ScoreType } from "../../utilities/ScoreType";

export interface UpdateMusic {
  title?: string;
  description?: string;
  scoreType?: ScoreType;
  languages?: string[];
  relatedPhrasesIds?: string[];
  categoryIds?: string[];
  audioFile?: File;
  composers?: string;
  yearOfComposition?: string;
  arrangers?: string;
  yearOfArrangement?: string;
  verifiedById?: string;
  updatedById?: string;
}
