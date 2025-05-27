import { client } from "./client";

export type AccessInfo = {email: string, access_level: 'full' | 'restricted'}

export const getAccess = () => client.call<AccessInfo>('/auth/access')