import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedNameToUserAndNumberOfDownloadsToMusic1599771259329 implements MigrationInterface {
    name = 'AddedNameToUserAndNumberOfDownloadsToMusic1599771259329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `firstName` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `lastName` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `numberOfDownloads` bigint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `numberOfDownloads`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `lastName`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `firstName`");
    }

}
