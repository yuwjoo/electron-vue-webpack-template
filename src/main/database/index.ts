import "reflect-metadata";
import { DataSource } from "typeorm";
import { Photo } from "./entitys/photo";
import { app } from "electron";
import path from "path";

let databasePath: string;

if (process.env.NODE_ENV === "development") {
  databasePath = process.env.DATABASE_NAME;
} else {
  databasePath = path.join(app.getPath("userData"), process.env.DATABASE_NAME);
}

export let AppDataSource: DataSource;

/**
 * 初始化数据库
 */
export async function initDatabase() {
  AppDataSource = new DataSource({
    type: "sqlite",
    database: databasePath,
    entities: [Photo],
    synchronize: true,
    logging: false,
  });

  // to initialize the initial connection with the database, register all entities
  // and "synchronize" database schema, call "initialize()" method of a newly created database
  // once in your application bootstrap
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.log(error);
  }
}
