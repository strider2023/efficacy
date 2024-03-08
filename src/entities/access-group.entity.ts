import { 
    Entity, 
    Column, 
    ManyToOne,
} from "typeorm"
import { AppBaseEntity } from "./base.entity"
import { Collection } from "./collection.entity"

@Entity({ name: "efficacy_access_group", schema: "efficacy" })
export class AccessGroup extends AppBaseEntity {

    @Column({ nullable: false, unique: true })
    accessGroupId: string

    @Column({ nullable: false })
    displayName: string

    @Column({ nullable: true })
    description?: string

    @ManyToOne(() => Collection, (c) => c.collectionId)
    properties: Collection[]
}
