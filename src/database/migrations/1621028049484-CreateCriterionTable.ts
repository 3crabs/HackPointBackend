import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCriterionTable1621028049484 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'criterion',
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
                    isNullable: true,
                }, {
                    name: 'priority',
                    type: 'integer',
                    isPrimary: false,
                    isNullable: true,
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('criterion');
    }

}
