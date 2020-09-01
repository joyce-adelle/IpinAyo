import { RelatedPhrases } from "../entities/RelatedPhrases";
import { RelatedPhrasesSeed } from "./RelatedPhrases.seed";
import { createConnection } from "typeorm";
import { Category } from "../entities/Category";
import { Music } from "../entities/Music";
import { ScoreType } from "../../utilities/ScoreType";
import { User } from "../entities/User";
import { UserRole } from "../../utilities/UserRoles";
import { CompositionType } from "../../utilities/CompositionType";
import { UserSeed } from "./User.seed";

async function main() {
  let connection = await createConnection();
  const cat = connection.getRepository(Category);
  const rel = connection.getRepository(RelatedPhrases);
  const user = connection.getRepository(User);
  const mus = connection.getRepository(Music);

  rel.save(RelatedPhrasesSeed);

  let user1 = new User();
  user1.username = "user10";
  user1.email = "user10@mail.com";
  user1.password = "user10secret";
  user1.isComposer = false;
  const user1Save = await user.save(user1);

  user.save(UserSeed);

  let sanctusPhrase = new RelatedPhrases();
  sanctusPhrase.phrase = "sanctus";
  const sanctusPhraseSave = await rel.save(sanctusPhrase);

  let holyPhrase = new RelatedPhrases();
  holyPhrase.phrase = "holy holy holy";
  holyPhrase.groupId = sanctusPhraseSave.groupId;
  const holyPhraseSave = await rel.save(holyPhrase);

  let user10 = new User();
  user10.username = "user10";
  user10.email = "user10@mail.com";
  user10.password = "user10secret";
  user10.role = UserRole.Superadmin;
  user10.isComposer = true;
  user10.typeOfCompositions = [CompositionType.Sacred];

  const liturgy = new Category();
  liturgy.name = "Liturgy";
  const liturgySave = await cat.save(liturgy);

  const liturgyOfWord = new Category();
  liturgyOfWord.name = "Liturgy of Word";
  liturgyOfWord.parent = liturgy;
  const liturgyOfWordSave = await cat.save(liturgyOfWord);

  const liturgyOfEucharist = new Category();
  liturgyOfEucharist.name = "Liturgy of Eucharist";
  liturgyOfEucharist.parent = liturgy;
  const liturgyOfEucharistSave = await cat.save(liturgyOfEucharist);

  const introductoryRites = new Category();
  introductoryRites.name = "Introductory Rites";
  introductoryRites.parent = liturgy;
  const introductoryRitessave = await cat.save(introductoryRites);

  const concludingRites = new Category();
  concludingRites.name = "Concluding Rites";
  concludingRites.parent = liturgy;
  const concludingRitessave = await cat.save(concludingRites);

  const entrance = new Category();
  entrance.name = "Entrance";
  entrance.parent = introductoryRites;
  const entrancesave = await cat.save(entrance);

  const creed = new Category();
  creed.name = "Creed";
  creed.parent = introductoryRites;
  const creedSave = await cat.save(creed);

  const communion = new Category();
  communion.name = "Communion";
  communion.parent = liturgyOfEucharist;
  const communionSave = await cat.save(communion);

  const sanctus = new Category();
  sanctus.name = "Sanctus";
  sanctus.parent = liturgyOfEucharist;
  const sanctusSave = await cat.save(sanctus);

  const ritesAndRituals = new Category();
  ritesAndRituals.name = "Rites and Rituals";
  await cat.save(ritesAndRituals);

  const sacraments = new Category();
  sacraments.name = "Sacraments";
  sacraments.parent = ritesAndRituals;
  await cat.save(sacraments);

  const baptism = new Category();
  baptism.name = "Baptism";
  baptism.parent = sacraments;
  await cat.save(baptism);

  const confirmation = new Category();
  confirmation.name = "Confirmation";
  confirmation.parent = sacraments;
  await cat.save(confirmation);

  const holyOrder = new Category();
  holyOrder.name = "Holy Order";
  holyOrder.parent = sacraments;
  await cat.save(holyOrder);

  const matrimony = new Category();
  matrimony.name = "Matrimony";
  matrimony.parent = sacraments;
  await cat.save(matrimony);

  const adorationAndBenediction = new Category();
  adorationAndBenediction.name = "Adoration and Benediction";
  adorationAndBenediction.parent = ritesAndRituals;
  await cat.save(adorationAndBenediction);

  const song1 = new Music();
  song1.categories = [sanctusSave];
  song1.score = "Mimo l'Oluwa - Ehimanre & Victus.pdf";
  song1.composers = "Ehimanre Asuelinmen, Victus Eze";
  song1.description = "Sanctus in Yoruba";
  song1.languages = ["yoruba"];
  song1.scoreType = ScoreType.Vocal;
  song1.title = "Mimo l'Oluwa";
  song1.yearOfComposition = "2017";
  song1.relatedPhrases = [sanctusPhraseSave];
  song1.uploadedBy = user10;
  song1.isVerified = true;

  connection.close();
}

main();
