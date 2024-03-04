const { db } = require('@vercel/postgres');
const { textEntries, users } = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}


async function seedTextEntries(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS textEntries (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      text TEXT NOT NULL
    );  
    `;
    
    console.log(`Created "textEntries" table`);

      // Insert data into the "invoices" table
      const insertedTextEntries = await Promise.all(
        textEntries.map(
          (textEntry) => client.sql`
          INSERT INTO textEntries (id, title, text)
          VALUES (${textEntry.id}, ${textEntry.title}, ${textEntry.text})
          ON CONFLICT (id) DO NOTHING;
        `,
        ),
      );
  
      console.log(`Seeded ${textEntries.length} textEntries`);
  
      return {
        createTable,
        textEntries: insertedTextEntries,
      };
  } catch (error) {
    console.error('Error seeding textEntries:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedTextEntries(client);
  await seedUsers(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
