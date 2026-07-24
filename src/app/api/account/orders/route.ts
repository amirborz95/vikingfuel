import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const users = await readUsers();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const orders = user.orders || [];
    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, action, order, orderId } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const users = await readUsers();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.orders) {
      user.orders = [];
    }

    if (action === 'add') {
      if (!order) {
        return NextResponse.json(
          { error: 'Order data is required' },
          { status: 400 }
        );
      }
      const newOrder = {
        id: Date.now().toString(),
        ...order,
        createdAt: new Date().toISOString(),
      };
      user.orders.push(newOrder);
    } else if (action === 'delete') {
      if (!orderId) {
        return NextResponse.json(
          { error: 'Order ID is required' },
          { status: 400 }
        );
      }
      user.orders = user.orders.filter((o: any) => o.id !== orderId);
    }

    await writeUsers(users);
    return NextResponse.json({ success: true, orders: user.orders });
  } catch (error: any) {
    console.error('Order management error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to manage orders' },
      { status: 500 }
    );
  }
}
