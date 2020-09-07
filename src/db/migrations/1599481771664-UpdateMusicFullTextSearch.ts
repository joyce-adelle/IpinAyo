import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateMusicFullTextSearch1599481771664 implements MigrationInterface {
    name = 'UpdateMusicFullTextSearch1599481771664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE FULLTEXT INDEX `IDX_691e99699b0d2dfaaa7a6a83c5` ON `music` (`title`, `composers`, `arrangers`, `description`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_691e99699b0d2dfaaa7a6a83c5` ON `music`");
    }

}
