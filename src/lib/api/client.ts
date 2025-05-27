import { Client } from "@pacuare/sdk";

export const client = new Client('', import.meta.env.API_URL ?? undefined);