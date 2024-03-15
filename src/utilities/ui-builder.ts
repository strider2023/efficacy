import { ApiError } from "../errors";
import { MetadataProperty } from "../entities";
import { WebUIBuilder } from "./web-ui-builder";

export class UIBuilder {
    static async getConfig(adatper: string, props: MetadataProperty[]): Promise<any> {
        if (adatper === 'web') {
            return new WebUIBuilder().getUIConfig(props);
        } else {
            throw new ApiError("Page Config Error", 500, 'Invalid adapter type');
        }
    }
}