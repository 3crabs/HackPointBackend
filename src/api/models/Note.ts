import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Criterion } from './Criterion';
import { Referee } from './Referee';
import { Team } from './Team';

@Entity()
export class Note {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public text: string;

    @Column()
    public refereeId: number;

    @Column()
    public criterionId: number;

    @Column()
    public teamId: number;

    @ManyToOne(() => Team, team => team.points)
    @JoinColumn()
    public team: Team;

    @ManyToOne(() => Referee, referee => referee.notes)
    @JoinColumn()
    public referee: Referee;

    @ManyToOne(() => Criterion, criterion => criterion.notes)
    @JoinColumn()
    public criterion: Criterion;
}
