import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Point } from './Point';

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

    @OneToMany(() => Point, point => point.referee)
    public points: Point[];

    @BeforeInsert()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private setCreateDate(): void {
        this.createdAt = Date.now();
    }
}
