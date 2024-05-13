const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_DBNAME = process.env.MONGO_DBNAME;
const MONGO_STAT_DBNAME = MONGO_DBNAME + "_stat";

db.getSiblingDB(MONGO_DBNAME).createUser({ user: MONGO_USER, pwd: MONGO_PASS, roles: [{ role: "dbOwner", db: MONGO_DBNAME }]});

db.getSiblingDB(MONGO_STAT_DBNAME).createUser({ user: MONGO_USER, pwd: MONGO_PASS, roles: [{ role: "dbOwner", db: MONGO_STAT_DBNAME }]});