import {
    BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { Referee } from './Referee';
import { Team } from './Team';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public surname: string;

    @Column()
    public isReferee: boolean;

    @Column()
    public login: string;

    @Column()
    public github: string;

    @Column()
    public password: string;

    @Column()
    public token: string;

    @Column()
    public teamId: number;

    @Column()
    public refereeId: number;

    @Column()
    public birthDate: number;

    @Column()
    public createdAt: number;

    @ManyToOne(() => Team, team => team.points)
    @JoinColumn()
    public team: Team;

    @OneToOne(() => Referee, referee => referee.user)
    @JoinColumn()
    public referee: Referee;

    @BeforeInsert()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private setCreateDate(): void {
        this.createdAt = Date.now();
    }
}
