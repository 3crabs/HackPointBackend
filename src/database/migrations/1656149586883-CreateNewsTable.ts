import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNewsTable1656149586883 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {

        const table = new Table({
            name: 'news',
            columns: [
                {
                    name: 'id',
                    type: 'serial',
                    isPrimary: true,
                    isNullable: false,
                }, {
                    name: 'title',
                    type: 'text',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'description',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'banner',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'date',
                    type: 'date',
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
        await queryRunner.dropTable('news');
    }

}
