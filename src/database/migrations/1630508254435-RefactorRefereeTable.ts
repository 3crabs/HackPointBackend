import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RefactorRefereeTable1630508254435 implements MigrationInterface {

    private teamIdColumn = new TableColumn({
        name: 'token',
        type: 'text',
        isPrimary: false,
        isNullable: true,
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('referee', this.teamIdColumn);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('referee', this.teamIdColumn);
    }

}
