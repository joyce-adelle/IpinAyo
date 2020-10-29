import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveNoOfDownloadsFromMusic1603926504306 implements MigrationInterface {
    name = 'RemoveNoOfDownloadsFromMusic1603926504306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `numberOfDownloads`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` ADD `numberOfDownloads` bigint NOT NULL DEFAULT '0'");
    }

}
