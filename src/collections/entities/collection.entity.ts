import { 
    Entity, 
    Column, 
    OneToMany,
    ManyToOne
} from "typeorm"
import { CollectionMetadataProperty } from "./collection-metadata-property.entity"
import { AppBaseEntity } from "../../common/base.entity"
import { Application } from "../../application/application.entity"

@Entity({ name: "efficacy_collection" })
export class Collection extends AppBaseEntity {

    @Column({ nullable: false })
    name: string

    @Column({ nullable: true })
    description?: string

    @Column({ nullable: false })
    schemaName: string

    @ManyToOne(() => Application, (app) => app.name)
    application: Application

    @OneToMany(() => CollectionMetadataProperty, (cmp) => cmp.propertyName)
    properties: CollectionMetadataProperty[]
}
