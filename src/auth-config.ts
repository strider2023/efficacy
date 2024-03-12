
import * as dotenv from "dotenv";
import * as express from "express";
import * as jwt from 'jsonwebtoken';

dotenv.config();

const { SECRET_KEY, TOKEN_ISSUER } =
    process.env;

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === 'jwt') {
        const token = request.headers['authorization'];

        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error('No token provided'));
            }

            jwt.verify(token, SECRET_KEY, function (err: any, decoded: any) {
                console.log(err, decoded)
                if (err) {
                    reject(err);
                } else {
                    for (let scope of scopes) {
                        if (decoded.role != scope) {
                            reject(new Error("JWT does not contain required scope."));
                        }
                    }
                    if (decoded.iss != TOKEN_ISSUER) {
                        reject(new Error('JWT error'));
                    }
                    resolve(decoded);
                }
            });
        });
    }
}