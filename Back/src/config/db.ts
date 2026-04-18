import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";

// Esto es provisional, en lo que se migran los demás endpoints a prisma
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });

const prisma = new PrismaClient({ adapter });

export default prisma;