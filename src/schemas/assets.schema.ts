import { BaseSchema } from "./base.schema";

export interface Assets extends BaseSchema {
    assetId: string;
    filename: string;
    mimetype: string;
    destination: string;
    path: string;
    description?: string;
    tags?: string[];
    filesize: number;
}