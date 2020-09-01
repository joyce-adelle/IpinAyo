import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedComposerUpdateMusicComposers1598946567813 implements MigrationInterface {
    name = 'RemovedComposerUpdateMusicComposers1598946567813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_f6555dcb85c7cf818b089be76f7`");
        await queryRunner.query("DROP INDEX `REL_f6555dcb85c7cf818b089be76f` ON `user`");
        await queryRunner.query("ALTER TABLE `user` CHANGE `composerId` `typeOfCompositions` int NULL");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `composerName`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `arrangerName`");
        await queryRunner.query("ALTER TABLE `music` ADD `composers` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `arrangers` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `typeOfCompositions`");
        await queryRunner.query("ALTER TABLE `user` ADD `typeOfCompositions` set ('sacred', 'secular') NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `typeOfCompositions`");
        await queryRunner.query("ALTER TABLE `user` ADD `typeOfCompositions` int NULL");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `arrangers`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `composers`");
        await queryRunner.query("ALTER TABLE `music` ADD `arrangerName` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `composerName` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `user` CHANGE `typeOfCompositions` `composerId` int NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_f6555dcb85c7cf818b089be76f` ON `user` (`composerId`)");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_f6555dcb85c7cf818b089be76f7` FOREIGN KEY (`composerId`) REFERENCES `composer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
