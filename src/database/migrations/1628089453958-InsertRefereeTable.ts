import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRefereeTable1628089453958 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "referee" ("login", "password") VALUES ('superadmin', '1a1dc91c907325c69271ddf0c944bc72') RETURNING id`
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "referee" WHERE login = 'superadmin'`);
    }

}
