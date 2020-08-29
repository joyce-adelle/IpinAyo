import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateMusicWithDateColumns1598666049122 implements MigrationInterface {
    name = 'UpdateMusicWithDateColumns1598666049122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` ADD `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `music` ADD `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `music` ADD `verifiedAt` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `music` ADD `verifiedById` int NULL");
        await queryRunner.query("ALTER TABLE `music` ADD UNIQUE INDEX `IDX_1a18aa8188c41c48ce75003193` (`verifiedById`)");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_1a18aa8188c41c48ce75003193` ON `music` (`verifiedById`)");
        await queryRunner.query("ALTER TABLE `music` ADD CONSTRAINT `FK_1a18aa8188c41c48ce750031938` FOREIGN KEY (`verifiedById`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `music` DROP FOREIGN KEY `FK_1a18aa8188c41c48ce750031938`");
        await queryRunner.query("DROP INDEX `REL_1a18aa8188c41c48ce75003193` ON `music`");
        await queryRunner.query("ALTER TABLE `music` DROP INDEX `IDX_1a18aa8188c41c48ce75003193`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `verifiedById`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `verifiedAt`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `updatedAt`");
        await queryRunner.query("ALTER TABLE `music` DROP COLUMN `createdAt`");
    }

}
