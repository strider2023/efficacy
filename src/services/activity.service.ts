import { TABLE_ACTIVITY } from "../constants/tables.constants";
import { Activity } from "../schemas";
import { BaseService } from "./base.service";

export class ActivityService extends BaseService<Activity>{

    constructor() {
        super(TABLE_ACTIVITY, 'Activity')
    }
}