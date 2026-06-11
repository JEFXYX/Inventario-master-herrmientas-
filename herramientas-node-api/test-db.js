const { Client } = require('pg');

async function tryPassword(password) {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Mi_DataBase',
    password: password,
    port: 5438,
  });
  try {
    await client.connect();
    console.log(`SUCCESS with password: "${password}"`);
    await client.end();
    return true;
  } catch (err) {
    return false;
  }
}

async function run() {
  const passwords = ['postgres', 'root', 'admin', '1234', '12345', '123456', ''];
  for (let p of passwords) {
    if (await tryPassword(p)) {
      process.exit(0);
    }
  }
  console.log('FAILED to find password');
  process.exit(1);
}

run();
