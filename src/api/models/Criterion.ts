import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

}
