
import { neon  } from "@neondatabase/serverless";
import { ENV } from "./env.js";
import * as schema from "../db/schema.js";
import { drizzle } from 'drizzle-orm/neon-http';



const sql = neon(ENV.DATABASE_URL);
export const db = drizzle(sql, { schema });