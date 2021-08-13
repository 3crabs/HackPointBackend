import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class RefactorNoteTable1621072215648 implements MigrationInterface {

    private criterionForeignKey = new TableForeignKey({
        name: 'fk_note_criterion',
        columnNames: ['criterionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'criterion',
        onDelete: 'CASCADE',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('note', this.criterionForeignKey);
        await queryRunner.query(`ALTER TABLE note DROP COLUMN "criterionId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE note ADD COLUMN "criterionId" integer`);
        await queryRunner.createForeignKey('note', this.criterionForeignKey);
    }

}
