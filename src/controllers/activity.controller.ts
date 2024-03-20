import { Post, Route, Tags, Get, Body, Queries, Security, Controller, SuccessResponse } from "tsoa";
import { ActivityService } from "../services";
import { AppQueryParams, AppGetAll, CreateActivity } from "../interfaces";

@Route("api/activity")
@Tags("Efficacy Activity APIs")
export class ActivityController extends Controller {

    @Get()
    @Security("jwt")
    public async getAll(
        @Queries() queryParams: AppQueryParams
    ): Promise<AppGetAll> {
        return new ActivityService().getAll(queryParams);
    }

    @SuccessResponse("201", "Created")
    @Post()
    @Security("jwt")
    public async create(
        @Body() request: CreateActivity
    ): Promise<void> {
        this.setStatus(201)
        await new ActivityService().create(request);
        return;
    }
}