import { 
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    OneToOne
} from "typeorm"
import { Collection } from "./collection.entity"
import { PropertyTypes } from "../enums"
import { AppBaseEntity } from "./base.entity"
import { ArrayViewProperty } from "./array-view-property.entity"
import { MetadataViewProperty } from "./metadata-view-property.entity"

@Entity({ name: "efficacy_metadata_property", schema: "efficacy" })
export class MetadataProperty extends AppBaseEntity {

    @ManyToOne(() => Collection, (cm) => cm.collectionId)
    collection: Collection

    // For Parent Child Mapping
    @ManyToOne(() => MetadataProperty, (category) => category.children, { nullable: true })
    parent?: MetadataProperty

    @OneToMany(() => MetadataProperty, (category) => category.parent, { nullable: true })
    children?: MetadataProperty[]

    @OneToOne(() => MetadataViewProperty)
    @JoinColumn()
    viewProperty?: MetadataViewProperty

    @OneToOne(() => ArrayViewProperty)
    @JoinColumn()
    arrayOptions?: ArrayViewProperty

    @Column({ nullable: false })
    propertyName: string

    @Column({ nullable: false })
    displayName: string

    @Column({ nullable: true })
    description?: string

    @Column({
        type: "enum",
        enum: PropertyTypes,
        default: PropertyTypes.STRING,
        nullable: false,
    })
    type: string

    @Column({ nullable: false })
    required: boolean

    @Column({ nullable: true, default: false })
    isUnique?: boolean;

    @Column({ nullable: true })
    default?: string;

    // Used for value range for Number
    // Used for string length for text
    // Used for file size limit for asset
    @Column({ nullable: true })
    maximum?: number;
  
    @Column({ nullable: true })
    minimum?: number;

    @Column({ nullable: true })
    pattern?: string;

    @Column({ nullable: true })
    isEnum?: boolean;

    @Column("simple-array", { nullable: true })
    enumValues?: string[];
}
