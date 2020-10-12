import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedVerificationColumnToUser1601534816125 implements MigrationInterface {
    name = 'AddedVerificationColumnToUser1601534816125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `isVerified` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `isVerified`");
    }

}
