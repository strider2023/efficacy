import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt'
import { getDatabaseAdapter } from './knex-config';
import { Status } from '../enums';
import { TABLE_ROLES, TABLE_USERS } from '../constants/tables.constants';

dotenv.config();

const { ADMIN_EMAIL, ADMIN_PASSWORD } =
    process.env;

export async function seed() {
    //Create default application roles
    let admin = await getDatabaseAdapter()
        .from(TABLE_ROLES)
        .where('roleId', 'efficacy_admin')
        .where('status', Status.ACTIVE)
        .first();
    if (!admin) {
        await getDatabaseAdapter()
            .into(TABLE_ROLES)
            .insert({
                roleId: 'efficacy_admin',
                displayName: 'Efficacy Admin',
                description: 'Do not delete!!!',
                adminAccess: true,
                portalAccess: true,
                appAccess: true
            });
        admin = await getDatabaseAdapter()
            .from(TABLE_ROLES)
            .where('roleId', 'efficacy_admin')
            .where('status', Status.ACTIVE)
            .first();
    } else {
        console.info("Default admin role exists");
    }

    // Create default user
    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
        const user = await getDatabaseAdapter()
            .from(TABLE_USERS)
            .where('email', ADMIN_EMAIL)
            .where('status', Status.ACTIVE)
            .first();
        if (!user) {
            const salt = bcrypt.genSaltSync(10);
            const request = {
                firstname: 'Efficacy',
                lastname: 'Admin',
                email: ADMIN_EMAIL,
                password: bcrypt.hashSync(ADMIN_PASSWORD, salt),
                roleId: admin.id
            }
            await getDatabaseAdapter()
                .into(TABLE_USERS)
                .insert(request);
        } else {
            console.info("Default admin exists");
        }
    } else {
        console.error("Default Admin email and password not provided!!");
    }
}