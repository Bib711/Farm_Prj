import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'farmmarket';

// Middleware to verify token and check ownership
async function verifyAuth(request: Request, productId: string) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'No token provided', status: 401 };
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };

    const userResult = await pool.query('SELECT id, role FROM users WHERE id = $1', [decoded.userId]);
    if (userResult.rows.length === 0) {
      return { error: 'User not found', status: 404 };
    }

    const user = userResult.rows[0];

    if (user.role === 'admin') {
      return { userId: user.id, role: user.role };
    }

    if (user.role !== 'farmer') {
      return { error: 'Unauthorized access', status: 403 };
    }

    const productResult = await pool.query('SELECT owner_id FROM products WHERE id = $1', [productId]);
    if (productResult.rows.length === 0) {
      return { error: 'Product not found', status: 404 };
    }

    if (productResult.rows[0].owner_id !== user.id) {
      return { error: 'Unauthorized access', status: 403 };
    }

    return { userId: user.id, role: user.role };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authResult = await verifyAuth(request, params.id);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const updates = await request.json();
    const allowedFields = ['name', 'category', 'price', 'image', 'description', 'quantity', 'in_stock'];

    const validUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as Record<string, any>);

    if (Object.keys(validUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const setClause = Object.keys(validUpdates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = [...Object.values(validUpdates), params.id];

    const result = await pool.query(
      `UPDATE products SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const authResult = await verifyAuth(request, params.id);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;
    const result = await pool.query(
      `SELECT p.*, u.name as owner_name FROM products p LEFT JOIN users u ON p.owner_id = u.id WHERE p.id = $1`,
      [productId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}