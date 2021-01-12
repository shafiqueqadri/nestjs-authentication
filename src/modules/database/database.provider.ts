import * as mongoose from 'mongoose';
import {env} from 'process'

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(env.MONGO_URI || 'mongodb://localhost:27017/stardeos?readPreference=primary&appname=MongoDB%20Compass&ssl=false'),
  },
];