import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Criterion } from './Criterion';
import { Referee } from './Referee';

@Entity()
export class Point {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public point: number;

    @Column()
    public refereeId: number;

    @Column()
    public criterionId: number;

    @ManyToOne(() => Referee, referee => referee.points)
    @JoinColumn()
    public referee: Referee;

    @ManyToOne(() => Criterion, criterion => criterion.points)
    @JoinColumn()
    public criterion: Criterion;
}
