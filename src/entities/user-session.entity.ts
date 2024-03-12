import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "efficacy_user_session", schema: "efficacy" })
export class UserSession extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "text", nullable: false, unique: true })
    token: string;

    @Column({ type: "text", nullable: true })
    ip?: string;

    @Column({ type: "text", generated: 'uuid', nullable: false, unique: true })
    refreshToken?: string;

    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP', nullable: false })
    created?: Date;

    @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP', nullable: false })
    expiry?: Date;
}