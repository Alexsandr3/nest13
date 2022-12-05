import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { BlogViewModel } from "../src/modules/blogs/infrastructure/query-repository/blog-View-Model";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('blogs_01', () => {
    it(`01 - should create new blog; status 201; content: created blog`, async () => {
      const createResponse = await request(app)
        .post(`/blogs`)
        //.set('Authorization', `Basic YWRtaW46cXdlcnR5`)
        .send({
          name: "supertest_02",
          description: "Data for constructing new Blog entity",
          websiteUrl: 'https://www.youtube.com/watch?v=cHVhpNrjcPs&list=PLcvhF2Wqh7DP4tZ851CauQ8GqgqlCocjk'
        })
        .expect(201)

      const createBlog: BlogViewModel = createResponse.body
      expect(createBlog).toEqual({
        id: expect.any(String),
        name: "supertest_01",
        description: "Data for constructing new Blog entity",
        websiteUrl: 'https://www.youtube.com/watch?v=vuzKKCYXISA',
        createdAt: expect.any(String)
      })
    })

  })

 /* it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });*/
});
