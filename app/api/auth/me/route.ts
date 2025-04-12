import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'farmmarket';

// Helper function to ensure we always return JSON
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// Handle OPTIONS requests (CORS preflight)
export async function OPTIONS() {
  return jsonResponse({});
}

export async function GET(req: Request) {
  // Verify we're not handling an options request which might be confused
  if (req.method === 'OPTIONS') {
    return jsonResponse({});
  }
  
  console.log('Auth /me endpoint called');
  
  try {
    let token;
    
    // Check for token in Authorization header first
    const authHeader = req.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log('Token found in header');
    } else {
      // If no Authorization header, check cookies
      const cookieStore = await cookies(); // Add 'await' here
      token = cookieStore.get('token')?.value;
      console.log('Token in cookies:', token ? 'Present' : 'Missing');
    }
    
    if (!token) {
      console.log('No valid token found in header or cookies');
      return jsonResponse({ error: 'No token provided' }, 401);
    }

    console.log('Token received, verifying...');

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      console.log('Token verified for user ID:', decoded.userId);

      // Get user from database
      const result = await pool.query(
        'SELECT id, name, email, role FROM users WHERE id = $1',
        [decoded.userId]
      );

      const user = result.rows[0];

      if (!user) {
        console.log('User not found in database');
        return jsonResponse({ error: 'User not found' }, 404);
      }

      console.log('User authenticated successfully:', user.name);
      return jsonResponse({ user });
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return jsonResponse({ error: 'Invalid token' }, 401);
    }
  } catch (error) {
    console.error('Auth error:', error);
    return jsonResponse({ error: 'Authentication failed', details: String(error) }, 500);
  }
}