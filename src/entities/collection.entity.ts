import {
    Entity,
    Column,
    OneToMany
} from "typeorm"
import { MetadataProperty } from "./metadata-property.entity"
import { AppBaseEntity } from "./base.entity"

@Entity({ name: "efficacy_collection", schema: "efficacy" })
export class Collection extends AppBaseEntity {

    @Column({ nullable: false, unique: true })
    collectionId: string

    @Column({ nullable: false })
    displayName: string

    @Column({ nullable: true })
    description?: string

    @Column({ nullable: false })
    schemaName: string

    @Column({ nullable: false, unique: true })
    tableName: string

    @OneToMany(() => MetadataProperty, (cmp) => cmp.propertyName)
    properties: MetadataProperty[]

    @Column("simple-array", { nullable: true })
    permissions?: string[]
}
