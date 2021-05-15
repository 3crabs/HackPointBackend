import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class RefactorPointTable1621058307259 implements MigrationInterface {

    private teamIdColumn = new TableColumn({
        name: 'teamId',
        type: 'integer',
        isPrimary: false,
        isNullable: true,
    });

    private teamForeignKey = new TableForeignKey({
        name: 'fk_point_team',
        columnNames: ['teamId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'team',
        onDelete: 'CASCADE',
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('point', this.teamIdColumn);
        await queryRunner.createForeignKey('note', this.teamForeignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('point', this.teamIdColumn);
    }


}
