import { AppDataSource } from "./data-source"
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import * as swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import { ValidateError } from "tsoa";
import * as morgan from "morgan";
import helmet from "helmet";
import * as path from "path";
import { AssetsManagerService } from "./services/assets-manager.service";
import * as cors from "cors";
import { bootstrapEfficacy } from "./config/bootstrap-config";
import { rateLimiterConfig } from "./config/rate-limiter-config";
import { errorHandlerMiddleware } from "./config/error-config";
import { RedisClient } from "./config/redis-config";

dotenv.config();

const { PORT = 3000 } = process.env;
let server = null;
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static('admin'));
app.use(cors());
app.use(helmet());
app.use(rateLimiterConfig);

app.use("/api-docs",
    swaggerUi.serve,
    async (_req: Request, res: Response) => {
        return res.send(
            swaggerUi.generateHTML(
                await import("../build/swagger.json"),
                undefined,
                {
                    oauth2RedirectUrl: `http://localhost:3000/api-docs`
                })
        );
    });

app.get("/", (req, res) => {
    res.sendFile('/admin/index.html');
});

RegisterRoutes(app);

app.get("/api/assets/:assetId", async (req, res) => {
    const assetDetails = await new AssetsManagerService().getByAssetId(req.params.assetId);
    const filePath = path.join(__dirname, '../uploads/', req.params.assetId);
    console.log(filePath, assetDetails);
    res.status(200);
    res.setHeader('Content-disposition', 'attachment; filename=' + assetDetails.filename);
    res.setHeader('Content-type', assetDetails.mimetype);
    res.download(filePath, assetDetails.filename);
});

app.use((_req, res: Response) => {
    res.status(404).send({
        message: "Not Found",
    });
});

app.use(errorHandlerMiddleware);

AppDataSource.initialize().then(async () => {
    RedisClient.getInstance().connect();
    server = app.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
    bootstrapEfficacy();
}).catch(error => console.log(error))

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    RedisClient.getInstance().disconnect();
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    AppDataSource.destroy();
}
