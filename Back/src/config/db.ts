import { config } from "dotenv";
config();
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";

// Esto es provisional, en lo que se migran los demás endpoints a prisma
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL no está definida en el .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;