import {MigrationInterface, QueryRunner} from 'typeorm';

export class InsertRefereeTable1628089453958 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "referee" ("login", "password") VALUES ('superadmin', 'd79096188b670c2f81b7001f73801117') RETURNING id`
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "referee" WHERE login = 'superadmin'`);
    }

}
