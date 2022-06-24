import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Note } from './Note';
import { Point } from './Point';
import { User } from './User';

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
    public token: string;

    @Column()
    public createdAt: number;

    @OneToMany(() => Point, point => point.referee)
    public points: Point[];

    @OneToMany(() => Note, note => note.referee)
    public notes: Note[];

    @OneToOne(() => User, user => user.referee)
    public user: User;

    @BeforeInsert()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private setCreateDate(): void {
        this.createdAt = Date.now();
    }
}
