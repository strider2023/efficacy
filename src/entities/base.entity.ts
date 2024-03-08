import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Status } from "../enums";

export abstract class AppBaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: "enum",
        enum: Status,
        default: Status.ACTIVE,
        nullable: false,
    })
    status: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}