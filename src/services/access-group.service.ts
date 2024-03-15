import { Status } from "../enums/enums";
import { AccessGroup } from "../entities";
import { IAccessGroup, IUpdateAccessGroup } from "../interfaces";
import { ApiError } from "../errors";

export class AccessGroupService {

    public async getAccessGroups(): Promise<AccessGroup[]> {
        const accessGroups = await AccessGroup.find({
            where: {
                status: Status.ACTIVE
            }
        });
        return accessGroups;
    }

    public async create(request: IAccessGroup) {
        try {
            const accessGroup = new AccessGroup()
            accessGroup.accessGroupId = request.accessGroupId;
            accessGroup.displayName = request.displayName;
            accessGroup.description = request.description;
            await accessGroup.save();
        } catch (e) {
            throw new ApiError("Access Group", 500, e.message);
        }
    }

    public async update(accessGroupId: string, request: IUpdateAccessGroup) {
        try {
            const accessGroup = await AccessGroup.findOneBy({ accessGroupId: accessGroupId });
            accessGroup.displayName = request.displayName;
            accessGroup.description = request.description;
            await accessGroup.save();
        } catch (e) {
            throw new ApiError("Access Group", 500, e.message);
        }
    }

    public async delete(accessGroupId: string) {
        try {
            const accessGroup = await AccessGroup.findOneBy({ accessGroupId: accessGroupId });
            accessGroup.status = Status.DELETED;
            await accessGroup.save();
        } catch (e) {
            throw new ApiError("Access Group", 500, e.message);
        }
    }
}