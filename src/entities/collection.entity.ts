import {
    Entity,
    Column,
    OneToMany
} from "typeorm"
import { MetadataProperty } from "./metadata-property.entity"
import { AppBaseEntity } from "./base.entity"
import { CollectionAccessType } from "../enums"
import { AccessGroup } from "./access-group.entity"

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

    @Column({
        type: "enum",
        enum: CollectionAccessType,
        default: CollectionAccessType.PUBLIC,
        nullable: false,
    })
    createAccessType?: string

    @OneToMany(() => AccessGroup, (ag) => ag.accessGroupId, { nullable: true })
    createAccessGroup?: AccessGroup[]

    @Column({
        type: "enum",
        enum: CollectionAccessType,
        default: CollectionAccessType.PUBLIC,
        nullable: false,
    })
    readAccessType?: string

    @OneToMany(() => AccessGroup, (ag) => ag.accessGroupId, { nullable: true })
    readAccessGroup?: AccessGroup[]

    @Column({
        type: "enum",
        enum: CollectionAccessType,
        default: CollectionAccessType.PUBLIC,
        nullable: false,
    })
    updateAccessType?: string

    @OneToMany(() => AccessGroup, (ag) => ag.accessGroupId, { nullable: true })
    updateAccessGroup?: AccessGroup[]

    @Column({
        type: "enum",
        enum: CollectionAccessType,
        default: CollectionAccessType.PUBLIC,
        nullable: false,
    })
    deleteAccessType?: string

    @OneToMany(() => AccessGroup, (ag) => ag.accessGroupId, { nullable: true })
    deleteAccessGroup?: AccessGroup[]
}

// submitButtonOptions {props.disabled, norender, submitText}
