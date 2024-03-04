import {
    Entity,
    Column,
    ManyToOne
} from "typeorm"
import { AppBaseEntity } from "../common/base.entity"
import { Application } from "../application/application.entity";

@Entity({ name: "application_asset" })
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

    @ManyToOne(() => Application, (app) => app.name)
    application: Application
}
