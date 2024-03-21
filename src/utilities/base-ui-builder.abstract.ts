import { CollectionProperty } from "../schemas";

export abstract class BaseUIBuilder {
    public abstract getUIConfig(properties: CollectionProperty[]): any;
}