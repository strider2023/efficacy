import {
    Entity,
    Column
} from "typeorm"
import { AppBaseEntity } from "./base.entity"

@Entity({ name: "efficacy_assets", schema: "efficacy" })
export class ApplicationAsset extends AppBaseEntity {

    @Column({ nullable: false, unique: true })
    assetId: string;

    @Column({ nullable: false })
    filename: string;

    @Column({ nullable: false })
    mimetype: string;

    @Column({ nullable: true })
    description?: string;

    @Column("simple-array", { nullable: true })
    tags?: string[];

    @Column({ nullable: false })
    filesize: number;
}
