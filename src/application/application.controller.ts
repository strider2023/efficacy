import { Body, Controller, Delete, Get, Patch, Path, Post, Route, Tags } from "tsoa";
import { ApplicationDto } from "./application.interface";
import { ApplicationService } from "./application.service";
import { Application } from "./application.entity";

@Route("api/application")
@Tags("Efficacy Application APIs")
export class ApplicationController extends Controller {

    @Get()
    public async getApplications(): Promise<Application[]> {
        return new ApplicationService().getAll();
    }

    @Post()
    public async createApplication(
        @Body() request: ApplicationDto
    ): Promise<Application> {
        return new ApplicationService().create(request);
    }

    @Patch()
    public async updateApplication(
        @Body() request: ApplicationDto
    ): Promise<Application> {
        return new ApplicationService().update(request);
    }

    @Delete("{appName}")
    public async removeApplication(
        @Path() appName: string
    ): Promise<Application> {
        return new ApplicationService().remove(appName);
    }
}