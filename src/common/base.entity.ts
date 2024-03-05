import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Status } from "./enums";

export abstract class AppBaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number

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

    @DeleteDateColumn()
    deletedAt: Date;
}