import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import StoreItem, { StoreItemCategory } from '@/models/StoreItem';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/jwt';
import { OrderStatus } from '@/app/types/store';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
    const mongoDbSession = await mongoose.startSession();
    mongoDbSession.startTransaction();
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            await mongoDbSession.abortTransaction();
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const decodedUser = await verifyToken(token);
        if (!decodedUser || !decodedUser.id) {
            await mongoDbSession.abortTransaction();
            return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
        }

        await connectDB();
        const { itemId, quantity = 1 } = await request.json();

        if (!itemId || !mongoose.Types.ObjectId.isValid(itemId) || quantity <= 0) {
            await mongoDbSession.abortTransaction();
            return NextResponse.json({ success: false, error: 'Invalid item ID or quantity' }, { status: 400 });
        }

        const user = await User.findById(decodedUser.id).session(mongoDbSession);
        const item = await StoreItem.findById(itemId).session(mongoDbSession);

        if (!user) {
            await mongoDbSession.abortTransaction();
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }
        if (!item) {
            await mongoDbSession.abortTransaction();
            return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
        }
        if (!item.isActive) {
            await mongoDbSession.abortTransaction();
            return NextResponse.json({ success: false, error: 'Item is not available' }, { status: 400 });
        }

        const totalCoinCost = item.coinCost * quantity;

        if (user.coins < totalCoinCost) {
            await mongoDbSession.abortTransaction();
            return NextResponse.json({ success: false, error: 'Insufficient coins' }, { status: 400 });
        }

        if (item.inventory !== null && item.inventory < quantity) {
            await mongoDbSession.abortTransaction();
            return NextResponse.json({ success: false, error: 'Not enough items in stock' }, { status: 400 });
        }

        user.coins -= totalCoinCost;
        if (item.inventory !== null) {
            item.inventory -= quantity;
        }

        const orderItemData = {
            storeItemId: item._id,
            name: item.name,
            category: item.category,
            coinCost: item.coinCost,
            quantity: quantity,
            revealedRedeemCode: item.category === StoreItemCategory.REDEEM_CODE ? item.redeemCode : undefined,
            revealedRewardDetails: item.category === StoreItemCategory.DIGITAL_REWARD ? item.rewardDetails : undefined,
        };

        const newOrder = new Order({
            userId: user._id,
            items: [orderItemData],
            totalCoinCost: totalCoinCost,
            status: OrderStatus.COMPLETED,
        });

        await user.save({ session: mongoDbSession });
        await item.save({ session: mongoDbSession });
        await newOrder.save({ session: mongoDbSession });

        await mongoDbSession.commitTransaction();
        
        return NextResponse.json({ 
            success: true, 
            message: 'Purchase successful!', 
            order: newOrder,
            revealedCode: orderItemData.revealedRedeemCode,
            revealedDetails: orderItemData.revealedRewardDetails
        });

    } catch (error: any) {
        await mongoDbSession.abortTransaction();
        console.error('Store purchase error:', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, error: error.message, details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: 'Failed to process purchase' }, { status: 500 });
    } finally {
        mongoDbSession.endSession();
    }
} 