import { sql } from '@vercel/postgres';
import { TextEntry } from './definitions'
import { unstable_noStore as noStore } from 'next/cache';


export async function fetchRandomTextEntry() {
  noStore();

  try {
    console.log('Fetching random text entry...');

    const data = await sql<TextEntry>`SELECT * FROM textentries`;

    const randomIndex = Math.floor(Math.random() * data.rowCount);

    return data.rows[randomIndex];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch random text entry.');
  }
}