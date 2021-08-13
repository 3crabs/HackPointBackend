import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRefereeTable1621010898066 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'referee',
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
                    name: 'surname',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'type',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                    default: `'regular'`,
                }, {
                    name: 'login',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'password',
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
        await queryRunner.dropTable('referee');
    }

}
