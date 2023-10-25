import { MockContext, Context, createMockContext } from '@/__mocks__/context';
import request from 'supertest';
import server from '@/index';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test('should return status 200 and success = true', async () => {
  await request(server)
    .get('/')
    .expect('Content-type', /json/)
    .expect({ success: true })
    .expect(200);
});

afterEach(() => {
  server.close();
});

afterAll((done) => {
  done();
});
