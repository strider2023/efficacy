import {
    Entity,
    Column,
    OneToMany
} from "typeorm"
import { AppBaseEntity } from "../common/base.entity"
import { Collection } from "../collections/entities/collection.entity"

@Entity({ name: "application" })
export class Application extends AppBaseEntity {

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: false })
    displayName: string;

    @Column()
    description?: string;

    @OneToMany(() => Collection, (c) => c.id, { nullable: true })
    collections?: Collection[];
}
