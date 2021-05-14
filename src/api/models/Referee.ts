import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleReferee {
    REGULAR = 'regular',
    MAIN = 'main',
}

@Entity()
export class Referee {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public surname: string;

    @Column()
    public type: string;

    @Column()
    public login: string;

    @Column()
    public password: string;

    @Column()
    public createdAt: number;

    @BeforeInsert()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private setCreateDate(): void {
        this.createdAt = Date.now();
    }
}
