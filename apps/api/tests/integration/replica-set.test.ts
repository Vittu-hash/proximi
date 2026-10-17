import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import mongoose, { Schema } from 'mongoose';
import { connectDB, disconnectDB } from '../../src/config/db.js';

interface TestDoc {
  name: string;
}

const testSchema = new Schema<TestDoc>({
  name: { type: String, required: true }
});

const TestModel = mongoose.model<TestDoc>('TransactionTestDoc', testSchema);

describe('Replica Set Transactions', () => {
  beforeAll(async () => {
    await connectDB();
    await TestModel.createCollection();
    await TestModel.deleteMany({});
  });

  afterAll(async () => {
    await TestModel.collection.drop().catch(() => {});
    await disconnectDB();
  });

  it('commits a transaction and persists document', async () => {
    const session = await mongoose.startSession();
    session.startTransaction();
    await TestModel.create([{ name: 'committed-item' }], { session });
    await session.commitTransaction();
    await session.endSession();

    const found = await TestModel.findOne({ name: 'committed-item' });
    expect(found).not.toBeNull();
    expect(found?.name).toBe('committed-item');
  });

  it('aborts a transaction and rolls back document insertion', async () => {
    const session = await mongoose.startSession();
    session.startTransaction();
    await TestModel.create([{ name: 'aborted-item' }], { session });
    await session.abortTransaction();
    await session.endSession();

    const found = await TestModel.findOne({ name: 'aborted-item' });
    expect(found).toBeNull();
  });
});
