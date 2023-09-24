import * as dotenv from 'dotenv';

const envPath = `./.${process.env.NODE_ENV}.env`;
dotenv.config({ path: envPath });

const buildConnectionString = () => {
  return `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}`;
};

export const Config = {
  mongo: {
    uri: buildConnectionString()
  },
  environmentName: process.env.NODE_ENV,
  appPort: process.env.APP_PORT,
  protocol: "http://",
  subDomain: "",
  domain: "localhost",
}
