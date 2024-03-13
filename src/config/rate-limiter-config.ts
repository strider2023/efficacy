import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const { RATE_LIMITER_TIME_LIMIT_MILLIS, RATE_LIMITER_MAX_CALL_COUNT } =
    process.env;

export const rateLimiterConfig = rateLimit({
    windowMs: parseInt(RATE_LIMITER_TIME_LIMIT_MILLIS) || 1 * 60 * 60 * 1000,
    max: parseInt(RATE_LIMITER_MAX_CALL_COUNT) || 200,
    message: 'You have exceeded the 100 requests in 24 hrs limit!',
    standardHeaders: true,
    legacyHeaders: false,
});