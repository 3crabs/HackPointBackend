import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class CreateNoteForeignKeys1621050018903 implements MigrationInterface {

    private criterionForeignKey = new TableForeignKey({
        name: 'fk_note_criterion',
        columnNames: ['criterionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'criterion',
        onDelete: 'CASCADE',
    });

    private refereeForeignKey = new TableForeignKey({
        name: 'fk_note_referee',
        columnNames: ['refereeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'referee',
        onDelete: 'CASCADE',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKeys('note', [this.criterionForeignKey, this.refereeForeignKey]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys('note', [this.criterionForeignKey, this.refereeForeignKey]);
    }

}
