import { RelatedPhrases } from "../entities/RelatedPhrases";
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

  try {
    const cat = connection.getRepository(Category);
    const rel = connection.getRepository(RelatedPhrases);
    const user = connection.getRepository(User);
    const mus = connection.getRepository(Music);

    let kyriePhrase = new RelatedPhrases();
    kyriePhrase.phrase = "kyrie";
    await rel.save(kyriePhrase);

    let gloriaPhrase = new RelatedPhrases();
    gloriaPhrase.phrase = "gloria";
    await rel.save(gloriaPhrase);

    let creedPhrase = new RelatedPhrases();
    creedPhrase.phrase = "creed";
    await rel.save(creedPhrase);

    let offertoryPhrase = new RelatedPhrases();
    offertoryPhrase.phrase = "offertory";
    await rel.save(offertoryPhrase);

    let paterPhrase = new RelatedPhrases();
    paterPhrase.phrase = "pater nostram";
    await rel.save(paterPhrase);

    let sanctusPhrase = new RelatedPhrases();
    sanctusPhrase.phrase = "sanctus";
    const sanctusPhraseSave = await rel.save(sanctusPhrase);

    let agnusDeiPhrase = new RelatedPhrases();
    agnusDeiPhrase.phrase = "Agnus Dei";
    const agnusDeiPhraseSave = await rel.save(agnusDeiPhrase);

    let holyPhrase = new RelatedPhrases();
    holyPhrase.phrase = "holy holy holy";
    holyPhrase.groupId = sanctusPhraseSave.groupId;
    await rel.save(holyPhrase);

    let communionPhrase = new RelatedPhrases();
    communionPhrase.phrase = "communion";
    const communionPhraseSave = await rel.save(communionPhrase);

    let weddingPhrase = new RelatedPhrases();
    weddingPhrase.phrase = "wedding";
    const weddingPhraseSave = await rel.save(weddingPhrase);

    let dismissalPhrase = new RelatedPhrases();
    dismissalPhrase.phrase = "dismissal";
    const dismissalPhraseSave = await rel.save(dismissalPhrase);

    let loGPhrase = new RelatedPhrases();
    loGPhrase.phrase = "lamb of god";
    loGPhrase.groupId = agnusDeiPhraseSave.groupId;
    const loGPhraseSave = await rel.save(loGPhrase);

    const entrancePhrase = new RelatedPhrases();
    entrancePhrase.phrase = "entrance";
    const entrancePhraseSave = await rel.save(entrancePhrase);

    let user1 = new User();
    user1.username = "user1";
    user1.firstName = "User1";
    user1.lastName = "Happy1";
    user1.email = "user1@mail.com";
    user1.password = "user1secret";
    user1.isComposer = false;
    const user1Save = await user.save(user1);

    await user.save(UserSeed);

    let user10 = new User();
    user10.username = "user10";
    user10.firstName = "User10";
    user10.lastName = "Happy10";
    user10.email = "user10@mail.com";
    user10.password = "user10secret";
    user10.isVerified = true;
    user10.role = UserRole.Superadmin;
    user10.isComposer = true;
    user10.typeOfCompositions = [CompositionType.Sacred];
    const user10Save = await user.save(user10);

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
    await cat.save(concludingRites);

    const dismissal = new Category();
    dismissal.name = "Dismissal";
    dismissal.parent = concludingRites;
    const dismissalSave = await cat.save(dismissal);

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

    const agnusDei = new Category();
    agnusDei.name = "Agnus Dei";
    agnusDei.parent = liturgyOfEucharist;
    await cat.save(agnusDei);

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
    const matrimonySave = await cat.save(matrimony);

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
    song1.scoreType = ScoreType.Choral;
    song1.title = "Mimo l'Oluwa";
    song1.yearOfComposition = "2017";
    song1.relatedPhrases = [sanctusPhraseSave];
    song1.uploadedBy = user10Save;
    song1.isVerified = true;
    song1.verifiedBy = user10Save;
    song1.updatedBy = user10Save;

    const song2 = new Music();
    song2.categories = [entrancesave];
    song2.score = "Aa g'obu k'Owoicho - Jacob Okwori.pdf";
    song2.composers = "Jacob Okwori";
    song2.description = "Entrance Hymn in Idoma meaning come before God";
    song2.languages = ["Idoma"];
    song2.scoreType = ScoreType.Choral;
    song2.title = "Aa g'obu k'Owoicho";
    song2.yearOfComposition = "2011";
    song2.relatedPhrases = [entrancePhraseSave];
    song2.uploadedBy = user10Save;
    song2.isVerified = true;
    song2.verifiedBy = user10Save;
    song2.audio = "Aa G'obu K'owoicho (Live Mass).mp3";
    song2.updatedBy = user10Save;

    const song3 = new Music();
    song3.categories = [agnusDei];
    song3.score = "Lamb of God - Full Score.pdf";
    song3.composers = "Matthew Udoka (Rev. Fr.)";
    song3.description = "solemn lamb of God for Mass";
    song3.languages = ["english"];
    song3.scoreType = ScoreType.Full;
    song3.title = "Lamb of God";
    song3.relatedPhrases = [loGPhraseSave];
    song3.uploadedBy = user10Save;
    song3.isVerified = true;
    song3.verifiedBy = user10Save;
    song3.audio = "Lamb of God.mid";
    song3.arrangers = "Precious Owumi";
    song3.updatedBy = user10Save;

    const song4 = new Music();
    song4.categories = [matrimonySave, communionSave];
    song4.score = "O PERFECT LOVE.pdf";
    song4.composers = "Dorothy F. Gurney";
    song4.description = "Song about the perfect love of God";
    song4.languages = ["english"];
    song4.scoreType = ScoreType.Choral;
    song4.title = "O Perfect Love";
    song4.yearOfComposition = "1883";
    song4.relatedPhrases = [communionPhraseSave, weddingPhraseSave];
    song4.uploadedBy = user10Save;
    song4.isVerified = true;
    song4.verifiedBy = user10Save;
    song4.arrangers = "Joseph Barnby";
    song4.yearOfArrangement = "1889";
    song4.updatedBy = user10Save;

    const song5 = new Music();
    song5.categories = [communionSave];
    song5.score = "AnimaChristi.pdf";
    song5.composers = "Marco Frisina";
    song5.description = "Soul Of Christ in Latin";
    song5.languages = ["latin"];
    song5.scoreType = ScoreType.Vocal;
    song5.title = "Anima Christi";
    song5.relatedPhrases = [communionPhraseSave];
    song5.uploadedBy = user10Save;
    song5.isVerified = true;
    song5.verifiedBy = user10Save;
    song5.updatedBy = user10Save;

    const song6 = new Music();
    song6.categories = [entrancesave];
    song6.score = "Oni lojo pe.pdf";
    song6.description = "Entrance hymn in yoruba";
    song6.languages = ["yoruba"];
    song6.scoreType = ScoreType.Choral;
    song6.title = "Oni lojo pe";
    song6.relatedPhrases = [entrancePhraseSave];
    song6.uploadedBy = user1Save;
    song6.isVerified = false;
    song6.audio = "Oni l'ojo pe (Live Mass).mp3";
    song6.arrangers = "Daniel Ebhomien";
    song6.updatedBy = user1Save;

    const song7 = new Music();
    song7.categories = [communionSave];
    song7.score = "IReceivedtheLivingGod-leadsheetinE.pdf";
    song7.description = "Solemn communion hynm";
    song7.languages = ["english"];
    song7.scoreType = ScoreType.LeadSheet;
    song7.title = "I Received the Living God";
    song7.relatedPhrases = [communionPhraseSave];
    song7.uploadedBy = user1Save;
    song7.isVerified = false;
    song7.updatedBy = user1Save;

    const song8 = new Music();
    song8.categories = [dismissalSave];
    song8.score = "Now Thank we all our God.pdf";
    song8.description = "Thanksgiving to God";
    song8.languages = ["english"];
    song8.scoreType = ScoreType.Choral;
    song8.title = "Now Thank we all our God";
    song8.relatedPhrases = [dismissalPhraseSave];
    song8.uploadedBy = user1Save;
    song8.isVerified = false;
    song8.updatedBy = user1Save;

    await mus.save([song1, song2, song3, song4, song5, song6, song7, song8]);

    console.log("successful");
  } catch (error) {
    console.log(error);
    console.log("unsuccessful");
  } finally {
    connection.close();
  }
}

main();
