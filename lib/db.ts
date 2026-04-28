import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";

const rawUrl = process.env.DATABASE_URL!;
// Format: sqlserver://HOST:PORT;key=value;...
const withoutScheme = rawUrl.replace(/^sqlserver:\/\//, "");
const [hostPort, ...pairs] = withoutScheme.split(";");
const [server, rawPort] = hostPort.split(":");
const params = Object.fromEntries(
  pairs.filter(Boolean).map((p) => p.split("=") as [string, string])
);

const config = {
  server,
  port: Number(rawPort) || 1433,
  database: params.database,
  user: params.user,
  password: params.password,
  options: {
    encrypt: params.encrypt !== "false",
    trustServerCertificate: params.trustServerCertificate === "true",
  },
};

const adapter = new PrismaMssql(config);

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
