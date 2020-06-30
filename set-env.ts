import { writeFile } from 'fs';
// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
// Load node modules
const colors = require('colors');
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
require('dotenv').config({ path: envFile });

// `environment.ts` file structure
const envConfigFile = `export const environment = {
   production: false,
   MYSQL_PASSWORD: '${process.env.MYSQL_PASSWORD}',
   ACCESS_TOKEN_SECRET: '${process.env.ACCESS_TOKEN_SECRET}',
   REFRESH_TOKEN_SECRET: '${process.env.REFRESH_TOKEN_SECRET}',
   GRAPHQL_URI: '${process.env.GRAPHQL_URI}'
};
`;
// console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n'));
// console.log(colors.grey(envConfigFile));
writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(err);
   } else {
       console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
   }
});