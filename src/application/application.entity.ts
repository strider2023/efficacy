import {
    Entity,
    Column,
    OneToMany
} from "typeorm"
import { AppBaseEntity } from "../common/base.entity"
import { Collection } from "../collections/entities/collection.entity"
import { ApplicationAccessType } from "../common/enums";
import { ApplicationAsset } from "../assests-manager/assets-manager.entity";

@Entity({ name: "efficacy_application" })
export class Application extends AppBaseEntity {

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: false })
    displayName: string;

    @Column()
    description?: string;

    @Column({
        type: "enum",
        enum: ApplicationAccessType,
        default: ApplicationAccessType.PUBLIC,
        nullable: false,
    })
    accessType: string

    @OneToMany(() => Collection, (c) => c.name)
    collections: Collection[]

    @OneToMany(() => ApplicationAsset, (as) => as.assetId)
    assets: ApplicationAsset[]
}
