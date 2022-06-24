import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RefactorUserTable1656091404008 implements MigrationInterface {

    private teamIdColumn = new TableColumn({
        name: 'teamId',
        type: 'integer',
        isPrimary: false,
        isNullable: true,
    });

    private refereeIdColumn = new TableColumn({
        name: 'refereeId',
        type: 'integer',
        isPrimary: false,
        isNullable: true,
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('user',[this.teamIdColumn, this.refereeIdColumn]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumns('user', [this.teamIdColumn, this.refereeIdColumn]);
    }

}
