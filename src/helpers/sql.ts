import Database from "tauri-plugin-sql-api";

async function runMigrations(db: Database): Promise<void> {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS prs (
            id TEXT NOT NULL PRIMARY KEY,
            title TEXT NOT NULL,
            state TEXT NOT NULL,
            url TEXT NOT NULL,
            mergedAt TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            additions TEXT NOT NULL,
            deletions TEXT NOT NULL,
            branchName TEXT NOT NULL,
            authorLogin TEXT NOT NULL,
            authorAvatarUrl TEXT NOT NULL,
            repository INTEGER NOT NULL,
            reviewRequestedEventAt TEXT NOT NULL,
            JIRA TEXT NOT NULL,
            timeToMerge TEXT NOT NULL,
            timeToMergeRaw TEXT NOT NULL
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS repositories (
            id TEXT NOT NULL PRIMARY KEY,
            name TEXT NOT NULL,
            owner TEXT NOT NULL,
            language TEXT NOT NULL
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS commits (
            id TEXT NOT NULL PRIMARY KEY,
            message TEXT NOT NULL,
            prID TEXT NOT NULL
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS organizations (
            slug TEXT NOT NULL PRIMARY KEY
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS repositories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            owner TEXT NOT NULL,
            language TEXT NOT NULL,

            UNIQUE(name,owner)
        )
    `);
}

export default async function getDb(): Promise<Database> {
    // initialize db and check the migration to do.
    const db = await Database.load('sqlite:database.db');
    await runMigrations(db);

    return db;
}
