import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Quiz from '@/models/Quiz';
import Wallpaper from '@/models/Wallpaper';
import CraftlandCode from '@/models/CraftlandCode';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify the token
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    
    // Get user statistics
    const [quizzesTaken, wallpapersSaved, codesSubmitted, user] = await Promise.all([
      Quiz.countDocuments({ userId: payload.id }),
      Wallpaper.countDocuments({ savedBy: payload.id }),
      CraftlandCode.countDocuments({ userId: payload.id }),
      User.findById(payload.id).select('coins referrals')
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      stats: {
        quizzesTaken,
        wallpapersSaved,
        codesSubmitted,
        coins: user.coins || 0,
        referrals: user.referrals?.length || 0
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 