import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RefactorUserTable1656156657141 implements MigrationInterface {

    private avatarColumn = new TableColumn({
        name: 'avatar',
        type: 'text',
        isPrimary: false,
        isNullable: true,
    });

    private phoneColumn = new TableColumn({
        name: 'phone',
        type: 'text',
        isPrimary: false,
        isNullable: true,
    });

    private emailColumn = new TableColumn({
        name: 'email',
        type: 'text',
        isPrimary: false,
        isNullable: true,
    });

    private checkBoxColumn = new TableColumn({
        name: 'checkBox',
        type: 'boolean',
        isPrimary: false,
        isNullable: true,
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('user', [this.avatarColumn, this.phoneColumn, this.emailColumn, this.checkBoxColumn]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumns('user', [this.avatarColumn, this.phoneColumn, this.emailColumn, this.checkBoxColumn]);
    }

}
