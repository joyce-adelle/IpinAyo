import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateMusicScoreType1598947327796 implements MigrationInterface {
    name = 'UpdateMusicScoreType1598947327796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` CHANGE `scoreType` `scoreType` enum ('full', 'miniature', 'study', 'piano', 'choral', 'short', 'open', ' lead sheet', 'chord chart', 'tablature', ' lead sheet and accompaniment') NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` CHANGE `scoreType` `scoreType` enum ('full', 'miniature', 'study', 'piano', 'vocal', 'short', 'open', ' lead sheet', 'chord chart', 'tablature', ' lead sheet and accompaniment') NOT NULL");
    }

}
