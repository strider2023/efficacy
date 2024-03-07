import {
    Entity,
    Column,
} from "typeorm"
import { AppBaseEntity } from "./base.entity"
import { WidgetTypes, InputTypes, DateFormats } from "../enums"

@Entity({ name: "efficacy_metadata_view_property", schema: "efficacy" })
export class MetadataViewProperty extends AppBaseEntity {

    @Column({
        type: "enum",
        enum: WidgetTypes,
        nullable: false,
    })
    widget: string

    @Column({
        type: "enum",
        enum: InputTypes,
        nullable: true,
    })
    inputType?: string

    @Column({ nullable: true })
    autocomplete?: string

    @Column({ nullable: true, default: false })
    autofocus?: boolean

    @Column({ nullable: true, default: false })
    disabled?: boolean

    @Column({ nullable: true, default: false })
    readonly?: boolean

    @Column("simple-array", { nullable: true })
    enumDisabled?: string[]

    @Column({ nullable: true, default: false })
    filePreview?: boolean

    @Column({ nullable: true })
    helpText?: string

    @Column({ nullable: true, default: false })
    hideError?: boolean

    @Column({ nullable: true })
    placeholder?: string

    @Column("simple-array", { nullable: true })
    acceptedFileExtendsions?: string[]

    @Column({ type: "int", nullable: true, default: 4 })
    rows?: number

    @Column({ type: "int", nullable: true })
    yearsRangeStart?: number

    @Column({ type: "int", nullable: true })
    yearRangeEnd?: number

    @Column({
        type: "enum",
        enum: DateFormats,
        nullable: true,
    })
    format?: string
}
