import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'farmmarket';

// Helper function to ensure proper JSON responses
function jsonResponse(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// Handle OPTIONS requests (CORS preflight)
export async function OPTIONS() {
  return jsonResponse({});
}

export async function POST(req: Request) {
  console.log('Login API called');
  try {
    const { email, password } = await req.json();

    // Validate input
    console.log('Validating login inputs');
    if (!email || !password) {
      console.log('Missing required fields');
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    // Find user
    console.log(`Attempting to find user with email: ${email}`);
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      const user = result.rows[0];
      console.log('User found:', user ? 'Yes' : 'No');

      if (!user) {
        return jsonResponse({ error: 'Invalid credentials' }, 401);
      }

      // Check if user is admin
      console.log('Verifying password');
      let isValidPassword;

      if (user.role === 'admin') {
        // If the user is admin, do not use bcrypt for password verification (handle it however you want)
        isValidPassword = password === user.password; // In this case, just a simple equality check
        console.log('Admin password check: ', isValidPassword);
      } else {
        // If not admin, use bcrypt to compare the password
        isValidPassword = await bcrypt.compare(password, user.password);
      }

      if (!isValidPassword) {
        console.log('Invalid password');
        return jsonResponse({ error: 'Invalid credentials' }, 401);
      }

      // Generate JWT token
      console.log('Generating JWT token');
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Login successful');
      return jsonResponse({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return jsonResponse({ error: 'Database error' }, 500);
    }
  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
