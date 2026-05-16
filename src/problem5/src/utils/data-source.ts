import { DataSource } from "typeorm";
import config from "../config/config";
import { Resource } from "../model/resource";

export const SqliteDataSource = new DataSource({
    type: "sqlite",
    database: config.dbUrl,
    entities: [Resource],
    synchronize: true
});