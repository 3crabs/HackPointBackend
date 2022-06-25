import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Point } from './Point';
import { User } from './User';

export enum StatusTeam {
    UNMARKED = 'unmarked',
    PRESENT = 'present',
    NOT_PRESENT = 'not_present',
}

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public nameProject: string;

    @Column()
    public descriptionTeam: string;

    @Column()
    public descriptionReferee: string;

    @Column()
    public statusFirstPitch: string;

    @Column()
    public statusSecondPitch: string;

    @Column()
    public statusFinalPitch: string;

    @Column()
    public isBlocked: boolean;

    @Column()
    public createdAt: number;

    @OneToMany(() => Point, point => point.team)
    public points: Point[];

    @OneToMany(() => User, user => user.team)
    public users: User[];

    @BeforeInsert()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private setCreateDate(): void {
        this.createdAt = Date.now();
    }
}
