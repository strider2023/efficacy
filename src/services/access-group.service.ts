import { BaseService } from "./base.service";
import { AccessGroup } from "../schemas";

export class AccessGroupService extends BaseService<AccessGroup> {

    constructor() {
        super('efficacy.efficacy_access_group', 'Access Group')
    }
}