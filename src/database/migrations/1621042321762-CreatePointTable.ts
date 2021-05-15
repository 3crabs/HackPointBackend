import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePointTable1621042321762 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'point',
            columns: [
                {
                    name: 'id',
                    type: 'serial',
                    isPrimary: true,
                    isNullable: false,
                }, {
                    name: 'point',
                    type: 'integer',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'refereeId',
                    type: 'integer',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'criterionId',
                    type: 'integer',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'createdAt',
                    type: 'double precision',
                    isPrimary: false,
                    isNullable: true,
                    default: `${Date.now()}`,
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('point');
    }

}
