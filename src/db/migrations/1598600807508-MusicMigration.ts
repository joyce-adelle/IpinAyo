import {MigrationInterface, QueryRunner} from "typeorm";

export class MusicMigration1598600807508 implements MigrationInterface {
    name = 'MusicMigration1598600807508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `category` (`id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `music_categories_category` (`musicId` int NOT NULL, `categoryId` int NOT NULL, INDEX `IDX_2e8e3f806e7373b0bb4856cb88` (`musicId`), INDEX `IDX_8ec84011cd8eb4f980fcc0a410` (`categoryId`), PRIMARY KEY (`musicId`, `categoryId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `music` ADD `score` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `audio` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `title` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `description` text NOT NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `composerName` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `yearOfComposition` year NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `arrangerName` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `yearOfArrangement` year NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `languages` text NOT NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `scoreType` enum ('full', 'miniature', 'study', 'piano', 'vocal', 'short', 'open', ' lead sheet', 'chord chart', 'tablature', 'instrumental') NOT NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `isVerified` tinyint NOT NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `relatedWords` set ('lamb of God', 'kyrie') NOT NULL");
        await queryRunner.query("ALTER TABLE `music_categories_category` ADD CONSTRAINT `FK_2e8e3f806e7373b0bb4856cb88f` FOREIGN KEY (`musicId`) REFERENCES `music`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `music_categories_category` ADD CONSTRAINT `FK_8ec84011cd8eb4f980fcc0a410b` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music_categories_category` DROP FOREIGN KEY `FK_8ec84011cd8eb4f980fcc0a410b`");
        await queryRunner.query("ALTER TABLE `music_categories_category` DROP FOREIGN KEY `FK_2e8e3f806e7373b0bb4856cb88f`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `relatedWords`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `isVerified`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `scoreType`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `languages`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `yearOfArrangement`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `arrangerName`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `yearOfComposition`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `composerName`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `title`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `audio`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `score`");
        await queryRunner.query("DROP INDEX `IDX_8ec84011cd8eb4f980fcc0a410` ON `music_categories_category`");
        await queryRunner.query("DROP INDEX `IDX_2e8e3f806e7373b0bb4856cb88` ON `music_categories_category`");
        await queryRunner.query("DROP TABLE `music_categories_category`");
        await queryRunner.query("DROP TABLE `category`");
    }

}
