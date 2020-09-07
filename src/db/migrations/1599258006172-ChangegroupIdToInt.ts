import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangegroupIdToInt1599258006172 implements MigrationInterface {
    name = 'ChangegroupIdToInt1599258006172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `related_phrases` DROP COLUMN `groupId`");
        await queryRunner.query("ALTER TABLE `related_phrases` ADD `groupId` int NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `related_phrases` DROP COLUMN `groupId`");
        await queryRunner.query("ALTER TABLE `related_phrases` ADD `groupId` varchar(255) NOT NULL");
    }

}
