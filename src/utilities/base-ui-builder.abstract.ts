import { MetadataProperty } from "../entities";

export abstract class BaseUIBuilder {
    public abstract getUIConfig(properties: MetadataProperty[]): any;
}