import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Criterion } from './Criterion';
import { Referee } from './Referee';

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

    @ManyToOne(() => Referee, referee => referee.notes)
    @JoinColumn()
    public referee: Referee;

    @ManyToOne(() => Criterion, criterion => criterion.notes)
    @JoinColumn()
    public criterion: Criterion;
}
