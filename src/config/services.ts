import { ClientProviderOptions, Transport } from "@nestjs/microservices";
import { envs } from "./envs";

export const SERVICES_CONFIG: Record<string, ClientProviderOptions> = {
  PRODUCTS_SERVICE: {
    name: 'PRODUCTS_SERVICE',
    transport: Transport.TCP,
    options: {
      host: envs.PRODUCTS_MS_HOST,
      port: envs.PRODUCTS_MS_PORT,
    },
  }
};