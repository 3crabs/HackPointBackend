import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateHackatonTable1656134416469 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'hackaton',
            columns: [
                {
                    name: 'id',
                    type: 'serial',
                    isPrimary: true,
                    isNullable: false,
                }, {
                    name: 'name',
                    type: 'text',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'dateStart',
                    type: 'date',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'dateEnd',
                    type: 'date',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'place',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'banner',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'program',
                    type: 'jsonb',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'description',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
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
        await queryRunner.dropTable('hackaton');
    }

}
