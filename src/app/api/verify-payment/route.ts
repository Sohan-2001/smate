
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { database } from '@/lib/firebase';
import { ref, set } from 'firebase/database';

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    console.error('Razorpay webhook secret is not set.');
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }
  
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature not found.' }, { status: 400 });
  }

  try {
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(body);
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 403 });
    }
    
    const data = JSON.parse(body);

    if (data.event === 'subscription.charged') {
      const userId = data.payload.subscription.entity.notes.userId;
      if (userId) {
        const userUsageRef = ref(database, `users/${userId}/usage`);
        // Update user's subscription status to 'paid'
        // You might want to get the existing data and merge, but for this case, overwriting is fine.
        const today = new Date().toISOString().split('T')[0];
        await set(userUsageRef, {
            subscription: 'paid',
            chatCount: 0, // Reset chat count on upgrade
            lastChatDate: today,
        });
         console.log(`Successfully upgraded user ${userId} to paid subscription.`);
      } else {
         console.error('User ID not found in webhook payload notes.');
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook verification failed:', error);
    return NextResponse.json({ error: 'Webhook processing error.' }, { status: 500 });
  }
}
