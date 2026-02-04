import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { Connection } from 'mongoose';

export async function initMongoDB(
  configService: ConfigService,
  mongooseConnection: Connection,
) {
  const appUser: string = configService.get('MONGODB_USER')!;
  const appPass: string = configService.get('MONGODB_PASSWORD')!;
  const appDb: string = configService.get('MONGODB_TEST_DB')!;

  await mongooseConnection.asPromise();

  const adminDb = mongooseConnection.db!.admin();

  const usersInfo = await adminDb.command({ usersInfo: appUser });
  const userExists =
    (usersInfo.users as boolean) && (usersInfo.users as any[]).length > 0;

  if (!userExists) {
    await adminDb.command({
      createUser: appUser,
      pwd: appPass,
      roles: [{ role: 'readWrite', db: appDb }],
    });
    console.log(`DB user '${appUser}' created`);
  } else console.log('User exist!');

  const adminUser: string = configService.get('MONGODB_TEST_ADMIN_USER')!;
  const adminUserPass: string = configService.get(
    'MONGODB_TEST_ADMIN_PASSWORD',
  )!;
  const userUser: string = configService.get('MONGODB_TEST_USER')!;
  const userUserPass: string = configService.get('MONGODB_TEST_PASSWORD')!;

  const appDbInstance = mongooseConnection.useDb(appDb);

  const userCollection = appDbInstance.db?.collection('users');

  if (userCollection) {
    if ((await userCollection.countDocuments()) === 0) {
      await userCollection.insertMany([
        {
          login: adminUser,
          password: await bcrypt.hash(adminUserPass, 12),
          roles: ['user', 'admin'],
        },
        {
          login: userUser,
          password: await bcrypt.hash(userUserPass, 12),
          roles: ['user'],
        },
      ]);
    } else {
      console.log('Database is not empty!');
    }
  } else console.log('Database not found!');
}
