import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Point } from './Point';

@Entity()
export class Criterion {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column()
    public priority: number;

    @OneToMany(() => Point, point => point.referee)
    public points: Point[];
}
