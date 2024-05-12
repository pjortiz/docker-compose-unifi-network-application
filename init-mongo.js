console.log("START init-mongo.js ###########################################");
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_DBNAME = process.env.MONGO_DBNAME;
const MONGO_STAT_DBNAME = MONGO_DBNAME + "_stat";

console.log(`MONGO_USER=${MONGO_USER}`);
console.log(`MONGO_PASS=${MONGO_PASS}`);
console.log(`MONGO_DBNAME=${MONGO_DBNAME}`);
console.log(`MONGO_STAT_DBNAME=${MONGO_STAT_DBNAME}`);

db.getSiblingDB(MONGO_DBNAME).createUser({ user: MONGO_USER, pwd: MONGO_PASS, roles: [{ role: "dbOwner", db: MONGO_DBNAME }]});

db.getSiblingDB(MONGO_STAT_DBNAME).createUser({ user: MONGO_USER, pwd: MONGO_PASS, roles: [{ role: "dbOwner", db: MONGO_STAT_DBNAME }]});

console.log("END init-mongo.js ###########################################");