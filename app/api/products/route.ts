import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'farmmarket';

// Middleware to verify token and check role
async function verifyAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'No token provided', status: 401 };
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    
    // Check if user exists and has required role
    const userResult = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return { error: 'User not found', status: 404 };
    }

    const user = userResult.rows[0];
    if (user.role !== 'farmer' && user.role !== 'admin') {
      return { error: 'Unauthorized access', status: 403 };
    }

    return { userId: user.id, role: user.role };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

export async function POST(request: Request) {
  // Verify authentication and role
  const authResult = await verifyAuth(request);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { name, category, price, image, description, quantity } = await request.json();

    // Validate required fields
    if (!name || !category || !price || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new product
    const result = await pool.query(
      `INSERT INTO products 
        (name, category, price, image, description, quantity, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, category, price, image, description, quantity, authResult.userId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const search = searchParams.get('search');

    // Build the query based on filters
    let query = `
      SELECT 
        p.*,
        u.name as owner_name
      FROM products p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE 1=1
    `;
    const values: any[] = [];
    let paramCount = 1;

    if (category) {
      query += ` AND p.category = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    if (priceMin) {
      query += ` AND p.price >= $${paramCount}`;
      values.push(parseFloat(priceMin));
      paramCount++;
    }

    if (priceMax) {
      query += ` AND p.price <= $${paramCount}`;
      values.push(parseFloat(priceMax));
      paramCount++;
    }

    if (search) {
      query += ` AND (
        p.name ILIKE $${paramCount} OR 
        p.description ILIKE $${paramCount}
      )`;
      values.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, values);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
