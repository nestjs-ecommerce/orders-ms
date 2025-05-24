import "dotenv/config";
import * as joi from "joi";

interface Envs {
    PORT: number;
    DATABASE_URL: string;
    PRODUCTS_MS_HOST: string;
    PRODUCTS_MS_PORT: number;
    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    PORT: joi.number().required().default(2000),
    DATABASE_URL: joi.string().required(),
    PRODUCTS_MS_HOST: joi.string().required(),
    PRODUCTS_MS_PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
}).unknown(true);

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS ? process.env.NATS_SERVERS.split(",") : [],
});

if (error) {
    console.error("Environment variables validation error:", error.details);
    process.exit(1);
}

const envsValidates: Envs = value as Envs;

export const envs = {
    PORT: envsValidates.PORT,
    DATABASE_URL: envsValidates.DATABASE_URL,
    PRODUCTS_MS_HOST: envsValidates.PRODUCTS_MS_HOST,
    PRODUCTS_MS_PORT: envsValidates.PRODUCTS_MS_PORT,
    NATS_SERVERS: envsValidates.NATS_SERVERS,
}