const { join } = require('path');

module.exports = {
  type: 'sqlite',
  database: 'example-db.sqlite3',
  synchronize: false,
  logging: true,
  entities: ['apps/example-api/src/**/*.entity.{ts,js}'],
  migrations: ['apps/example-api/src/database/migrations/**/*.{ts,js}'],
  seeds: ['apps/example-api/src/database/seeds/**/*.{ts,js}'],
  factories: ['apps/example-api/src/database/factories/**/*{.ts,.js}'],
};
