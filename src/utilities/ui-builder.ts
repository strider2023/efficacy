import { ApiError } from "../errors";
import { WebUIBuilder } from "./web-ui-builder";

export class UIBuilder {
    static async getConfig(adatper: string, props: any[]): Promise<any> {
        if (adatper === 'web') {
            return new WebUIBuilder().getUIConfig(props);
        } else {
            throw new ApiError("Page Config Error", 500, 'Invalid adapter type');
        }
    }
}