import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class RefactorNominationTable1621061521166 implements MigrationInterface {

    private teamIdColumn = new TableColumn({
        name: 'teamId',
        type: 'integer',
        isPrimary: false,
        isNullable: true,
    });

    private teamForeignKey = new TableForeignKey({
        name: 'fk_nomination_team',
        columnNames: ['teamId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'team',
        onDelete: 'CASCADE',
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('nomination', this.teamIdColumn);
        await queryRunner.createForeignKey('nomination', this.teamForeignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('nomination', this.teamIdColumn);
    }
}
