import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateMusicScoreTypeAndYear1598972229830 implements MigrationInterface {
    name = 'UpdateMusicScoreTypeAndYear1598972229830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` ADD `updatedById` int NULL");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `yearOfComposition`");
        await queryRunner.query("ALTER TABLE `music` ADD `yearOfComposition` char(4) NULL");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `yearOfArrangement`");
        await queryRunner.query("ALTER TABLE `music` ADD `yearOfArrangement` char(4) NULL");
        await queryRunner.query("ALTER TABLE `music` CHANGE `scoreType` `scoreType` enum ('full', 'miniature', 'study', 'piano', 'vocal', 'choral', 'short', 'open', ' lead sheet', 'chord chart', 'tablature', ' lead sheet and accompaniment') NOT NULL");
        await queryRunner.query("ALTER TABLE `music` ADD CONSTRAINT `FK_e08b3c0149ec298629d7ad3de62` FOREIGN KEY (`updatedById`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` DROP FOREIGN KEY `FK_e08b3c0149ec298629d7ad3de62`");
        await queryRunner.query("ALTER TABLE `music` CHANGE `scoreType` `scoreType` enum ('full', 'miniature', 'study', 'piano', 'vocal', 'short', 'open', ' lead sheet', 'chord chart', 'tablature', ' lead sheet and accompaniment') NOT NULL");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `yearOfArrangement`");
        await queryRunner.query("ALTER TABLE `music` ADD `yearOfArrangement` year NULL");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `yearOfComposition`");
        await queryRunner.query("ALTER TABLE `music` ADD `yearOfComposition` year NULL");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `updatedById`");
    }

}
