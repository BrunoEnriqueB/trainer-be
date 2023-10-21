import {
  MockContext,
  Context,
  createMockContext
} from '../src/__mocks__/context';
import request from 'supertest';
import server from '../src/index';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test('should return 200', async () => {
  await request(server).get('/').expect(200);
});

afterEach(() => {
  server.close();
});

afterAll((done) => {
  done();
});
