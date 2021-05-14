import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    @BeforeInsert()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private setCreateDate(): void {
        this.createdAt = Date.now();
    }
}
