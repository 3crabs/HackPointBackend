import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hackaton {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public dateStart: Date;

    @Column()
    public dateEnd: Date;

    @Column()
    public place: string;

    @Column()
    public banner: string;

    @Column({
        type: 'jsonb',
        array: true,
        default: () => 'ARRAY[]::jsonb[]',
        nullable: false,
    })
    public program: { date: { time: string; description: string }[] }[];

    @Column()
    public description: string;

    @Column()
    public createdAt: number;

    @BeforeInsert()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private setCreateDate(): void {
        this.createdAt = Date.now();
    }
}
