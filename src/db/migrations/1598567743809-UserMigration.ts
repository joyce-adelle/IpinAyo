import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1598567743809 implements MigrationInterface {
    name = 'UserMigration1598567743809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `music` (`id` int NOT NULL AUTO_INCREMENT, `uploadedById` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `composer` (`id` int NOT NULL AUTO_INCREMENT, `typeOfCompositions` set ('liturgical', 'religious', 'classical', 'secular') NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `role` enum ('user', 'admin', 'superadmin') NOT NULL DEFAULT 'user', `isComposer` tinyint NOT NULL, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `composerId` int NULL, UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), UNIQUE INDEX `REL_f6555dcb85c7cf818b089be76f` (`composerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_downloads_music` (`userId` int NOT NULL, `musicId` int NOT NULL, INDEX `IDX_e7094f37cc24bf6b028abd669a` (`userId`), INDEX `IDX_00b23b59fe5c504b7af4fba227` (`musicId`), PRIMARY KEY (`userId`, `musicId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `music` ADD CONSTRAINT `FK_4ba400e56ff8d4d41516aefbb71` FOREIGN KEY (`uploadedById`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_f6555dcb85c7cf818b089be76f7` FOREIGN KEY (`composerId`) REFERENCES `composer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_downloads_music` ADD CONSTRAINT `FK_e7094f37cc24bf6b028abd669a3` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_downloads_music` ADD CONSTRAINT `FK_00b23b59fe5c504b7af4fba2274` FOREIGN KEY (`musicId`) REFERENCES `music`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_downloads_music` DROP FOREIGN KEY `FK_00b23b59fe5c504b7af4fba2274`");
        await queryRunner.query("ALTER TABLE `user_downloads_music` DROP FOREIGN KEY `FK_e7094f37cc24bf6b028abd669a3`");
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_f6555dcb85c7cf818b089be76f7`");
        await queryRunner.query("ALTER TABLE `music` DROP FOREIGN KEY `FK_4ba400e56ff8d4d41516aefbb71`");
        await queryRunner.query("DROP INDEX `IDX_00b23b59fe5c504b7af4fba227` ON `user_downloads_music`");
        await queryRunner.query("DROP INDEX `IDX_e7094f37cc24bf6b028abd669a` ON `user_downloads_music`");
        await queryRunner.query("DROP TABLE `user_downloads_music`");
        await queryRunner.query("DROP INDEX `REL_f6555dcb85c7cf818b089be76f` ON `user`");
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`");
        await queryRunner.query("DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP TABLE `composer`");
        await queryRunner.query("DROP TABLE `music`");
    }

}
