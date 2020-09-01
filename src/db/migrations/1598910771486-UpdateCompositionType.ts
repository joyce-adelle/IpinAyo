import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCompositionType1598910771486 implements MigrationInterface {
    name = 'UpdateCompositionType1598910771486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `composer` CHANGE `typeOfCompositions` `typeOfCompositions` set ('sacred', 'secular') NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `composer` CHANGE `typeOfCompositions` `typeOfCompositions` set ('liturgical', 'religious', 'classical', 'secular') NOT NULL");
    }

}
