import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTeamTable1621001494469 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'team',
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
                    name: 'nameProject',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'descriptionTeam',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'descriptionReferee',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'statusFirstPitch',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'statusSecondPitch',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'statusFinalPitch',
                    type: 'text',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'isBlocked',
                    type: 'boolean',
                    isPrimary: false,
                    isNullable: true,
                    default: true,
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
        await queryRunner.dropTable('team');
    }

}
