import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import StoreItem from '@/models/StoreItem';
import { verifyToken } from '@/lib/jwt';
import { StoreItemCategory } from '@/app/types/store';

// GET all store items (public or admin)
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const items = await StoreItem.find({ isActive: true }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        console.error('Error fetching store items:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch store items' }, { status: 500 });
    }
}

// POST a new store item (admin only)
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('admin-token')?.value;
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        
        const decoded = await verifyToken(token);
        // @ts-ignore
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        await connectDB();
        const data = await request.json();

        // Basic validation (more robust validation should be in the model or a service)
        if (!data.name || !data.category || data.coinCost === undefined) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }
        if (!Object.values(StoreItemCategory).includes(data.category)) {
            return NextResponse.json({ success: false, error: 'Invalid category' }, { status: 400 });
        }

        const newItem = new StoreItem(data);
        await newItem.save();
        return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating store item:', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, error: error.message, details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: 'Failed to create store item' }, { status: 500 });
    }
}

// PUT to update a store item (admin only)
export async function PUT(request: NextRequest) {
    try {
        const token = request.cookies.get('admin-token')?.value;
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyToken(token);
        // @ts-ignore
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
        }

        const data = await request.json();
        const updatedItem = await StoreItem.findByIdAndUpdate(id, data, { new: true, runValidators: true });

        if (!updatedItem) {
            return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updatedItem });
    } catch (error: any) {
        console.error('Error updating store item:', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, error: error.message, details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: 'Failed to update store item' }, { status: 500 });
    }
}

// DELETE a store item (admin only)
export async function DELETE(request: NextRequest) {
    try {
        const token = request.cookies.get('admin-token')?.value;
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyToken(token);
        // @ts-ignore
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
        }

        const deletedItem = await StoreItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting store item:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete store item' }, { status: 500 });
    }
} 