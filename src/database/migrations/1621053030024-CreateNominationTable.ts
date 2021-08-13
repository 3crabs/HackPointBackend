import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNominationTable1621053030024 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'nomination',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isNullable: false,
                }, {
                    name: 'name',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'description',
                    type: 'text',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'company',
                    type: 'text',
                    isPrimary: false,
                    isNullable: false,
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('nomination');
    }

}
