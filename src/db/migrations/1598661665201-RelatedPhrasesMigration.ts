import {MigrationInterface, QueryRunner} from "typeorm";

export class RelatedPhrasesMigration1598661665201 implements MigrationInterface {
    name = 'RelatedPhrasesMigration1598661665201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `related_phrases` (`id` int NOT NULL AUTO_INCREMENT, `phrase` varchar(255) NOT NULL, `groupId` varchar(255) NOT NULL, UNIQUE INDEX `IDX_3a385ee566ec326b73e79f8025` (`phrase`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `music_related_phrases_related_phrases` (`musicId` int NOT NULL, `relatedPhrasesId` int NOT NULL, INDEX `IDX_4f7a3f66ad3d90e0e86c3badd6` (`musicId`), INDEX `IDX_bb4d203e31d974ba91a6d6dec8` (`relatedPhrasesId`), PRIMARY KEY (`musicId`, `relatedPhrasesId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `relatedWords`");
        await queryRunner.query("ALTER TABLE `music_related_phrases_related_phrases` ADD CONSTRAINT `FK_4f7a3f66ad3d90e0e86c3badd66` FOREIGN KEY (`musicId`) REFERENCES `music`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `music_related_phrases_related_phrases` ADD CONSTRAINT `FK_bb4d203e31d974ba91a6d6dec8d` FOREIGN KEY (`relatedPhrasesId`) REFERENCES `related_phrases`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music_related_phrases_related_phrases` DROP FOREIGN KEY `FK_bb4d203e31d974ba91a6d6dec8d`");
        await queryRunner.query("ALTER TABLE `music_related_phrases_related_phrases` DROP FOREIGN KEY `FK_4f7a3f66ad3d90e0e86c3badd66`");
        await queryRunner.query("ALTER TABLE `music` ADD `relatedWords` set ('lamb of God', 'kyrie') NOT NULL");
        await queryRunner.query("DROP INDEX `IDX_bb4d203e31d974ba91a6d6dec8` ON `music_related_phrases_related_phrases`");
        await queryRunner.query("DROP INDEX `IDX_4f7a3f66ad3d90e0e86c3badd6` ON `music_related_phrases_related_phrases`");
        await queryRunner.query("DROP TABLE `music_related_phrases_related_phrases`");
        await queryRunner.query("DROP INDEX `IDX_3a385ee566ec326b73e79f8025` ON `related_phrases`");
        await queryRunner.query("DROP TABLE `related_phrases`");
    }

}
