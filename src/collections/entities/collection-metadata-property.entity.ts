import { 
    Entity,
    Column,
    ManyToOne,
    OneToMany
} from "typeorm"
import { Collection } from "./collection.entity"
import { PropertyTypes } from "../../common/enums"
import { AppBaseEntity } from "../../common/base.entity"

@Entity({ name: "metadata_property" })
export class CollectionMetadataProperty extends AppBaseEntity {

    @ManyToOne(() => Collection, (cm) => cm.name)
    collection: Collection

    @Column({ nullable: false })
    propertyName: string

    @Column({ nullable: true })
    description?: string

    @Column({
        type: "enum",
        enum: PropertyTypes,
        default: PropertyTypes.STRING,
        nullable: false,
    })
    propertyType: string

    @ManyToOne(() => CollectionMetadataProperty, (category) => category.children, { nullable: true })
    parent?: CollectionMetadataProperty

    @OneToMany(() => CollectionMetadataProperty, (category) => category.parent, { nullable: true })
    children?: CollectionMetadataProperty[]

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
