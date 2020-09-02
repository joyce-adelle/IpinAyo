import { ScoreType } from "../../utilities/ScoreType";

export interface CreateMusic {
  score: File;
  title: string;
  description: string;
  scoreType: ScoreType;
  languages: string[];
  relatedPhrasesIds: string[];
  categoryIds: string[];
  isVerified: boolean;
  uploadedById: string;
  audio?: File;
  composers?: string;
  yearOfComposition?: string;
  arrangers?: string;
  yearOfArrangement?: string;
  verifiedById?: string;
}
