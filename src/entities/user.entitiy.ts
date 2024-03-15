import { Entity, Column, OneToMany } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { UserTypes } from "../enums"
import { AccessGroup } from "./access-group.entity";

@Entity({ name: "efficacy_user", schema: "efficacy" })
export class User extends AppBaseEntity {

    @Column({ type: "text", nullable: false })
    firstname: string;

    @Column({ type: "text", nullable: true })
    middlename?: string;

    @Column({ type: "text", nullable: false })
    lastname: string;

    @Column({ type: "text", nullable: true, unique: true })
    phone: string;

    @Column({ type: "text", nullable: false, unique: true })
    email: string;

    @Column({ type: "text", nullable: false })
    password: string;

    @Column({ type: "date", nullable: true })
    dob?: Date;

    @Column({ type: "text", nullable: true })
    image?: string;

    @Column({
        type: "enum",
        enum: UserTypes,
        default: UserTypes.APP_USER,
        nullable: false,
    })
    role?: string

    @OneToMany(() => AccessGroup, (ag) => ag.accessGroupId, { nullable: true })
    accessGroup?: AccessGroup[]
}