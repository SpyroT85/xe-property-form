import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

// Connection pool reuses connections instead of opening a new one per request
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface Ad {
  id: number;
  title: string;
  type: 'rent' | 'buy' | 'exchange' | 'donation';
  area_place_id: string;
  area_main_text: string;
  area_secondary_text: string;
  price: number;
  description: string | null;
  created_at: string;
}

export interface CreateAdInput {
  title: string;
  type: 'rent' | 'buy' | 'exchange' | 'donation';
  area_place_id: string;
  area_main_text: string;
  area_secondary_text: string;
  price: number;
  description?: string;
}

export async function createAd(input: CreateAdInput): Promise<Ad> {
  const { rows } = await pool.query<Ad>(
    `INSERT INTO ads (title, type, area_place_id, area_main_text, area_secondary_text, price, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      input.title,
      input.type,
      input.area_place_id,
      input.area_main_text,
      input.area_secondary_text,
      input.price,
      input.description ?? null,
    ]
  );
  return rows[0];
}

// Returns all ads, newest first
export async function getAllAds(): Promise<Ad[]> {
  const { rows } = await pool.query<Ad>(
    `SELECT * FROM ads ORDER BY created_at DESC`
  );
  return rows;
}

// Returns true if the ad was found and deleted, false if it didn't exist
export async function deleteAd(id: number): Promise<boolean> {
  const { rowCount } = await pool.query(
    `DELETE FROM ads WHERE id = $1`,
    [id]
  );
  return (rowCount ?? 0) > 0;
}