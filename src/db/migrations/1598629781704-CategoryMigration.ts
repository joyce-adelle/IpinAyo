import {MigrationInterface, QueryRunner} from "typeorm";

export class CategoryMigration1598629781704 implements MigrationInterface {
    name = 'CategoryMigration1598629781704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `category_closure` (`id_ancestor` int NOT NULL, `id_descendant` int NOT NULL, INDEX `IDX_4aa1348fc4b7da9bef0fae8ff4` (`id_ancestor`), INDEX `IDX_6a22002acac4976977b1efd114` (`id_descendant`), PRIMARY KEY (`id_ancestor`, `id_descendant`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `category` ADD `name` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `category` ADD `parentId` int NULL");
        await queryRunner.query("ALTER TABLE `music` CHANGE `scoreType` `scoreType` enum ('full', 'miniature', 'study', 'piano', 'vocal', 'short', 'open', ' lead sheet', 'chord chart', 'tablature', ' lead sheet and accompaniment') NOT NULL");
        await queryRunner.query("ALTER TABLE `category` ADD CONSTRAINT `FK_d5456fd7e4c4866fec8ada1fa10` FOREIGN KEY (`parentId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `category_closure` ADD CONSTRAINT `FK_4aa1348fc4b7da9bef0fae8ff48` FOREIGN KEY (`id_ancestor`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `category_closure` ADD CONSTRAINT `FK_6a22002acac4976977b1efd114a` FOREIGN KEY (`id_descendant`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `category_closure` DROP FOREIGN KEY `FK_6a22002acac4976977b1efd114a`");
        await queryRunner.query("ALTER TABLE `category_closure` DROP FOREIGN KEY `FK_4aa1348fc4b7da9bef0fae8ff48`");
        await queryRunner.query("ALTER TABLE `category` DROP FOREIGN KEY `FK_d5456fd7e4c4866fec8ada1fa10`");
        await queryRunner.query("ALTER TABLE `music` CHANGE `scoreType` `scoreType` enum ('full', 'miniature', 'study', 'piano', 'vocal', 'short', 'open', ' lead sheet', 'chord chart', 'tablature', 'instrumental') NOT NULL");
        await queryRunner.query("ALTER TABLE `category` DROP COLUMN `parentId`");
        await queryRunner.query("ALTER TABLE `category` DROP COLUMN `name`");
        await queryRunner.query("DROP INDEX `IDX_6a22002acac4976977b1efd114` ON `category_closure`");
        await queryRunner.query("DROP INDEX `IDX_4aa1348fc4b7da9bef0fae8ff4` ON `category_closure`");
        await queryRunner.query("DROP TABLE `category_closure`");
    }

}
