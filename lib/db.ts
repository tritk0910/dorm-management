import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";

const url = new URL(process.env.DATABASE_URL!.replace("sqlserver://", "mssql://"));

const adapter = new PrismaMssql({
  server: url.hostname,
  port: url.port ? parseInt(url.port) : 1433,
  database: url.searchParams.get("database") ?? "",
  user: url.searchParams.get("user") ?? "",
  password: url.searchParams.get("password") ?? "",
  options: {
    encrypt: url.searchParams.get("encrypt") !== "false",
    trustServerCertificate: url.searchParams.get("trustServerCertificate") === "true",
  },
});

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma