import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {

    @Field(type => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column()
    public firstName: string;

    @Field({ nullable: true })
    @Column()
    public lastName?: string;

    @Field()
    @Column()
    public username: string;
}
