import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNoteTable1621049575145 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'note',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isNullable: false,
                }, {
                    name: 'text',
                    type: 'text',
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
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('note');
    }


}
