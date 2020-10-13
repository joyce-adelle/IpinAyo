import { CreateMusic } from "../../../db/inputInterfaces/CreateMusic";
import { ScoreType } from "../../../utilities/ScoreType";

export class UploadMusic {
  title: string;
  description: string;
  scoreType: ScoreType;
  languages: string[];
  relatedPhrasesIds: string[];
  categoryIds: string[];
  composers?: string;
  yearOfComposition?: string;
  arrangers?: string;
  yearOfArrangement?: string;
  scorePath: string;
  audioPath?: string;
  scoreFilename: string;
  audioFilename?: string;
}
