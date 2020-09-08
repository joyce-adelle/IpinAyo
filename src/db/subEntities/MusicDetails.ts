import { User } from "../entities/User";
import { ScoreType } from "../../utilities/ScoreType";
import { Category } from "../entities/Category";
import { RelatedPhrases } from "../entities/RelatedPhrases";

export class MusicDetails {
  id: string;

  scoreFile: File;

  audioFile: File;

  title: string;

  description: string;

  numberOfDownloads: number;

  composers: string;

  yearOfComposition: string;

  arrangers: string;

  yearOfArrangement: string;

  languages: string[];

  scoreType: ScoreType;

  isVerified: boolean;

  uploadedBy: User;

  categories: Category[];

  relatedPhrases: RelatedPhrases[];

  createdAt: Date;

  updatedAt: Date;

  updatedBy: User;

  verifiedAt: Date;

  verifiedBy: User;
}
