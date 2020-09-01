import { Category } from "../entities/Category";
import { RelatedPhrases } from "../entities/RelatedPhrases";
import { User } from "../entities/User";
import { Music } from "../entities/Music";
import { createConnection } from "typeorm";

async function main() {
  let connection = await createConnection();

  try {
    await connection
      .getRepository(RelatedPhrases)
      .query("delete from related_phrases");
    await connection.getRepository(Music).query("delete from music");
    await connection.getRepository(User).query("delete from user");
    await connection.manager.query("delete from music_categories_category");
    await connection.manager.query(
      "delete from music_related_phrases_related_phrases"
    );
    await connection.manager.query("delete from user_downloads_music");
    await connection.manager.query("delete from category_closure");

    let u = await connection.getTreeRepository(Category).findRoots();
    let i = Number(u[0].id) + 17;
    while (i >= Number(u[0].id)) {
      await connection.getTreeRepository(Category).delete(i);
      i--;
    }

    console.log("successful");
  } catch (error) {
    console.log(error);
  } finally {
    connection.close();
  }
}

main();
