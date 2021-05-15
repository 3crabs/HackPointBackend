import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorNoteTable1621072215648 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE note DROP COLUMN "criterionId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE note ADD COLUMN "criterionId" integer`);
    }

}
