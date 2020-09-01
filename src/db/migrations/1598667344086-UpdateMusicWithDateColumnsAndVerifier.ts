import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateMusicWithDateColumnsAndVerifier1598667344086 implements MigrationInterface {
    name = 'UpdateMusicWithDateColumnsAndVerifier1598667344086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` ADD `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `music` ADD `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `music` ADD `verifiedAt` timestamp(6) NULL");
        await queryRunner.query("ALTER TABLE `music` ADD `verifiedById` int NULL");
        await queryRunner.query("ALTER TABLE `music` ADD UNIQUE INDEX `IDX_03d08afeb69c2752d288e6a3ec` (`score`)");
        await queryRunner.query("ALTER TABLE `music` ADD CONSTRAINT `FK_1a18aa8188c41c48ce750031938` FOREIGN KEY (`verifiedById`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` DROP FOREIGN KEY `FK_1a18aa8188c41c48ce750031938`");
        await queryRunner.query("ALTER TABLE `music` DROP INDEX `IDX_03d08afeb69c2752d288e6a3ec`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `verifiedById`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `verifiedAt`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `updatedAt`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `createdAt`");
    }

}
