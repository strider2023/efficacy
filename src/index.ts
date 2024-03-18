import { AppDataSource } from "./data-source"
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import "reflect-metadata";
import * as swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import * as morgan from "morgan";
import helmet from "helmet";
import * as cors from "cors";
import { bootstrapEfficacy } from "./config/bootstrap-config";
import { rateLimiterConfig } from "./config/rate-limiter-config";
import { errorHandlerMiddleware } from "./config/error-config";
import { RedisClient } from "./config/redis-config";
import * as path from "path";

dotenv.config();

const { PORT = 3000 } = process.env;
let server = null;
const app = express();
app.use(express.json({ limit: '5MB' }));
app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use(rateLimiterConfig);
app.use(express.static('public'));

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

RegisterRoutes(app);

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
