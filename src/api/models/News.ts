import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class News {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;

    @Column()
    public description: string;

    @Column()
    public banner: string;

    @Column()
    public date: Date;

    @Column()
    public createdAt: number;

    @BeforeInsert()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private setCreateDate(): void {
        this.createdAt = Date.now();
    }
}
