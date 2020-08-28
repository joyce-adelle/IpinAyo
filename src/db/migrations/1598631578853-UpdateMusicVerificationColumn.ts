import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateMusicVerificationColumn1598631578853 implements MigrationInterface {
    name = 'UpdateMusicVerificationColumn1598631578853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` CHANGE `isVerified` `isVerified` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` CHANGE `isVerified` `isVerified` tinyint NOT NULL");
    }

}
