function getEnv(key) {
  return decodeURIComponent(process.env[key] || '');
}

//Create database admin

let appUser = getEnv('MONGO_APP_USER');
let appPass = getEnv('MONGO_APP_PASSWORD');
let appDb = getEnv('MONGO_INITDB_DATABASE');

db = db.getSiblingDB('admin');
db.createUser({
  user: appUser,
  pwd: appPass,
  roles: [{ role: 'readWrite', db: appDb }],
});

//Create default users in users collection

let adminUser = getEnv('MONGO_USERS_ADMIN_LOGIN');
let adminUserPass = getEnv('MONGO_USERS_ADMIN_PASSWORD_HASH');
let userUser = getEnv('MONGO_USERS_USER_LOGIN');
let userUserPass = getEnv('MONGOD_USERS_USER_PASSWORD_HASH');

db = db.getSiblingDB(appDb);
if (db.users.countDocuments({}) === 0) {
  db.users.insertMany([
    {
      login: adminUser,
      password: adminUserPass,
      roles: ['user', 'admin'],
    },
    {
      login: userUser,
      password: userUserPass,
      roles: ['user'],
    },
  ]);
  console.log('✅ Data added successfully!');
} else {
  console.log("⏭️ Database isn't empty.");
}
