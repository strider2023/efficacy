import { BaseService } from "./base.service";
import { Roles } from "../schemas";
import { TABLE_ROLES } from "../constants/tables.constants";

export class RolesService extends BaseService<Roles> {

    constructor(email) {
        super(TABLE_ROLES, 'Roles', email);
    }
}