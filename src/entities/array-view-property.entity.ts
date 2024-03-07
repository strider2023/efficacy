import {
    Entity,
    Column,
} from "typeorm"
import { AppBaseEntity } from "./base.entity"

@Entity({ name: "efficacy_array_view_property", schema: "efficacy" })
export class ArrayViewProperty extends AppBaseEntity {

    @Column({ nullable: true, default: false })
    orderable?: boolean

    @Column({ nullable: true, default: true })
    addable?: boolean

    @Column({ nullable: true, default: false })
    copyable?: boolean

    @Column({ nullable: true, default: true })
    removable?: boolean
}