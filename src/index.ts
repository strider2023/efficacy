import { AppDataSource } from "./data-source"
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import * as swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import { ValidateError } from "tsoa";
import * as morgan from "morgan";

import * as path from "path";
import { AssetsManagerService } from "./services/assets-manager.service";
import * as cors from "cors";
import { bootstrapEfficacy } from "./bootstrap-config";

dotenv.config();

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static('admin'));
app.use(cors());

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

app.use((
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }

    next();
});

AppDataSource.initialize().then(async () => {
    app.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
    bootstrapEfficacy();
}).catch(error => console.log(error))
