import {createConnection} from "typeorm";

export const databaseProviders = [
    {
        provide: 'CONNECTION',
        useFactory: async () => await createConnection({
            type: 'mssql',
            host: 'localhost',
            port: 1433,
            username: 'sa',
            password: '14101993aA!',
            database: 'baby_shop',
            entities: [
                __dirname + '/../**/*.entity{.ts,.js}',
            ],
            synchronize: true,
        }),
    },

];
