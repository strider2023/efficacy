import { AppDataSource } from "./data-source"
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import * as swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import { ValidateError } from "tsoa";
import * as morgan from "morgan";

dotenv.config();

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, async (_req: Request, res: Response) => {
    return res.send(
        swaggerUi.generateHTML(await import("../build/swagger.json"))
    );
});

app.use(function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): Response | void {
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

RegisterRoutes(app);

app.use(function notFoundHandler(_req, res: Response) {
    res.status(404).send({
        message: "Not Found",
    });
});

AppDataSource.initialize().then(async () => {
    app.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");

}).catch(error => console.log(error))
