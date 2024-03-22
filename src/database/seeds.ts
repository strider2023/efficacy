import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt'
import { ActivityTypes } from '../enums';
import { TABLE_ROLES, TABLE_USERS } from '../constants/tables.constants';
import { ActivityService, RolesService, UserService } from '../services';

dotenv.config();

const { ADMIN_EMAIL, ADMIN_PASSWORD } =
    process.env;

export async function seed() {
    //Create default application roles
    let admin = await new RolesService(null).get('efficacy_admin', 'roleId');
    let roleId = null;
    if (!admin) {
        roleId = await new RolesService(null).create({
            roleId: 'efficacy_admin',
            displayName: 'Efficacy Admin',
            description: 'Do not delete!!!',
            adminAccess: true,
            portalAccess: true,
            appAccess: true
        });
        await new ActivityService().create({
            action: ActivityTypes.CREATE,
            tableName: TABLE_ROLES,
            objectId: roleId.id,
            isSystem: true
        });
    } else {
        console.info("Default admin role exists");
    }

    // Create default user
    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
        const user = await new UserService().get(ADMIN_EMAIL, 'email');
        if (!user) {
            const salt = bcrypt.genSaltSync(10);
            const request = {
                firstname: 'Efficacy',
                lastname: 'Admin',
                email: ADMIN_EMAIL,
                password: bcrypt.hashSync(ADMIN_PASSWORD, salt),
                roleId: roleId.id
            }
            const user = await new UserService().create(request);
            await new ActivityService().create({
                action: ActivityTypes.CREATE,
                tableName: TABLE_USERS,
                objectId: user.id,
                isSystem: true
            });
        } else {
            console.info("Default admin exists");
        }
    } else {
        console.error("Default Admin email and password not provided!!");
    }
}