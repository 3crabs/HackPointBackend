import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class CreatePointForeignKeys1621043400356 implements MigrationInterface {

    private criterionForeignKey = new TableForeignKey({
        name: 'fk_point_criterion',
        columnNames: ['criterionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'criterion',
        onDelete: 'CASCADE',
    });

    private refereeForeignKey = new TableForeignKey({
        name: 'fk_point_referee',
        columnNames: ['refereeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'referee',
        onDelete: 'CASCADE',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKeys('point', [this.criterionForeignKey, this.refereeForeignKey]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys('point', [this.criterionForeignKey, this.refereeForeignKey]);
    }

}
