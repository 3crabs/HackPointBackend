import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Nomination {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column()
    public company: string;
}
