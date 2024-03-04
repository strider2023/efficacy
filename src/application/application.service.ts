import { Status } from "../common/enums";
import { Application } from "./application.entity";
import { ApplicationDto } from "./application.interface";

export class ApplicationService {

    public async getAll(): Promise<Application[]> {
        const applications = await Application.find({
            where: {
                status: Status.ACTIVE
            }
        });
        return applications;
    }

    public async create(request: ApplicationDto): Promise<Application> {
        const app = new Application();
        app.name = request.name;
        app.displayName = request.displayName;
        app.description = request.description;
        await app.save();
        return app;
    }

    public async update(request: ApplicationDto): Promise<Application> {
        const app = await Application.findOneBy({
            name: request.name
        });
        app.displayName = request.displayName;
        app.description = request.description;
        await app.save();
        return app;
    }

    public async remove(name: string): Promise<Application> {
        const app = await Application.findOneBy({
            name: name
        });
        app.status = Status.DELETED
        await app.save();
        return app;
    }
}