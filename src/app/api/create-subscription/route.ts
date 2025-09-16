
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { database } from '@/lib/firebase';
import { ref, get } from 'firebase/database';

const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const planId = process.env.RAZORPAY_SUBSCRIPTION_PLAN_ID;

if (!keyId || !keySecret || !planId) {
  throw new Error('Razorpay environment variables are not set.');
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // For a yearly plan
      notes: {
        userId: userId,
      },
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error: any) {
    console.error('Razorpay subscription creation failed:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
