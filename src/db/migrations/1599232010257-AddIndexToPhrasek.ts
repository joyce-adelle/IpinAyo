import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIndexToPhrasek1599232010257 implements MigrationInterface {
    name = 'AddIndexToPhrasek1599232010257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE FULLTEXT INDEX `IDX_FULLTEXTPHRASE` ON `related_phrases` (`phrase`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_FULLTEXTPHRASE` ON `related_phrases`");
    }

}
