module.exports = {
    client: "postgresql",
    connection: process.env.DATABASE_URL || {
        database: "uforms",
        user:     "uforms",
        password: "uforms",
    },
    pool: {min: 2, max: 10},
    migrations: {
        tableName: "migrations",
        directory: "./data/migrations",
    },
};
