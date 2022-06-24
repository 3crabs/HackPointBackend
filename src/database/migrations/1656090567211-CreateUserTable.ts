import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1656090567211 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'user',
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
                    isNullable: true,
                }, {
                    name: 'surname',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'isReferee',
                    type: 'boolean',
                    isPrimary: false,
                    isNullable: false,
                    default: false,
                }, {
                    name: 'github',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'login',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'token',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'password',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'birthDate',
                    type: 'double precision',
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
        await queryRunner.dropTable('user');
    }

}
