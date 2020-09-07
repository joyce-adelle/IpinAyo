import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateMusicFullTextSearch1599481771664 implements MigrationInterface {
    name = 'UpdateMusicFullTextSearch1599481771664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE FULLTEXT INDEX `IDX_691e99699b0d2dfaaa7a6a83c5` ON `music` (`title`)");
        await queryRunner.query("CREATE FULLTEXT INDEX `IDX_98760f5fd486026f23bef0f8bd` ON `music` (`composers`)");
        await queryRunner.query("CREATE FULLTEXT INDEX `IDX_021cabbd6d5653d5b5b5085a85` ON `music` (`arrangers`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_021cabbd6d5653d5b5b5085a85` ON `music`");
        await queryRunner.query("DROP INDEX `IDX_98760f5fd486026f23bef0f8bd` ON `music`");
        await queryRunner.query("DROP INDEX `IDX_691e99699b0d2dfaaa7a6a83c5` ON `music`");
    }

}
