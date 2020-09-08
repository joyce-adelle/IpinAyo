import { ScoreType } from "../../utilities/ScoreType";

export interface CreateMusic {
  scoreFile: File;
  title: string;
  description: string;
  scoreType: ScoreType;
  languages: string[];
  relatedPhrasesIds: string[];
  categoryIds: string[];
  uploadedById: string;
  audioFile?: File;
  composers?: string;
  yearOfComposition?: string;
  arrangers?: string;
  yearOfArrangement?: string;
}
