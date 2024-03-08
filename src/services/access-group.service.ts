import { Status } from "../enums/enums";
import { AccessGroup } from "../entities";
import { IAccessGroup, IUpdateAccessGroup } from "../interfaces";

export class AccessGroupService {

    public async getAccessGroups(): Promise<AccessGroup[]> {
        const accessGroups = await AccessGroup.find({
            where: {
                status: Status.ACTIVE
            }
        });
        return accessGroups;
    }

    public async create(request: IAccessGroup): Promise<AccessGroup> {
        const accessGroup = new AccessGroup()
        accessGroup.accessGroupId = request.accessGroupId;
        accessGroup.displayName = request.displayName;
        accessGroup.description = request.description;
        await accessGroup.save();
        return accessGroup;
    }

    public async update(accessGroupId: string, request: IUpdateAccessGroup): Promise<AccessGroup> {
        const accessGroup = await AccessGroup.findOneBy({ accessGroupId: accessGroupId });
        accessGroup.displayName = request.displayName;
        accessGroup.description = request.description;
        await accessGroup.save();
        return accessGroup;
    }

    public async delete(accessGroupId: string): Promise<AccessGroup> {
        const accessGroup = await AccessGroup.findOneBy({ accessGroupId: accessGroupId });
        accessGroup.status = Status.DELETED;
        await accessGroup.save();
        return accessGroup;
    }
}