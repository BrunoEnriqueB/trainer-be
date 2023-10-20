import {
  MockContext,
  Context,
  createMockContext
} from '../src/__mocks__/context';
import request from 'supertest';
import app from '../src/index';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test('should return 200', async () => {
  await request(app).get('/').expect(200);
});

afterAll((done) => {
  done();
});
