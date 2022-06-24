import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RefactorUserTable1656100635167 implements MigrationInterface {

    private roleColumn = new TableColumn({
        name: 'role',
        type: 'text',
        isPrimary: false,
        isNullable: true,
    });

    private isVerifiedColumn = new TableColumn({
        name: 'isVerified',
        type: 'boolean',
        isPrimary: false,
        isNullable: false,
        default: false,
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('user', [this.roleColumn, this.isVerifiedColumn]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumns('user', [this.roleColumn, this.isVerifiedColumn]);
    }

}
