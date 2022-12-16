import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { BlogViewModel } from "../src/modules/blogs/infrastructure/query-repository/blog-View-Model";
import { AppModule } from "../src/app.module";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { BlogModule } from "../src/modules/blogs/blog.module";
import { BloggersController } from "../src/modules/blogger/api/bloggers.controller";

describe("AppController (e2e)", () => {

  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let bloggersController: BloggersController;


  beforeAll(async () => {
    // Create a NestJS application
    const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    // Connect to the in-memory server
    await app.init();
    //Create a new MongoDB in-memory server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    // Get the connection string for the in-memory server
    await mongoose.connect(mongoUri);
  });
  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ imports: [BlogModule] }).compile();
    app = module.createNestApplication();
    await app.init();
    bloggersController = module.get<BloggersController>(BloggersController);
  });


  /*const emailTemplates = new MailModule()
  const emailAdapterLock: jest.Mocked<any> = {
    sendUserConfirmation: jest.fn()
  }
  const usersModule = new UsersModule()*/

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello free Belarus!");
  });


 /* it("should create a new blog post", async () => {
    const result = { login: "asirius23", password: "asirius2332", email: "fam@com.com" };
    jest.spyOn(CreateBlogCommand, "createBlog").mockImplementation(() => result);

    expect(await blogController.create(result)).toEqual(result);
  });*/








  it.skip("POST / should create a new user", () => {
    // Send a request to create a new user
    console.log("here");

    return request(app.getHttpServer())
      .post("sa/users")
      .set("Authorization", `Basic YWRtaW46cXdlcnR5`)
      .send({
        login: "asirius23",
        password: "asirius2332",
        email: "fam@com.com"
      })
      .expect(201);


    /* expect(createdUser.body).toEqual({
       id: expect.any(String),
       login: "asirius23",
       email: "fam@com.com",
       createdAt: expect.any(String),
       banInfo: {
         isBanned: false,
         banDate: null,
         banReason: null
       }
     });*/

  });
  it.skip(`01 - should create new blog; status 201; content: created blog`, async () => {
    const createResponse = await request(app.getHttpServer())
      .post(`/blogger/blogs`)
      //.set('Authorization', `Basic YWRtaW46cXdlcnR5`)
      .send({
        name: "supertest_01",
        description: "Data for constructing new Blog entity",
        websiteUrl:
          "https://www.youtube.com/watch?v=cHVhpNrjcPs&list=PLcvhF2Wqh7DP4tZ851CauQ8GqgqlCocjk"
      })
      .expect(201);

    const createBlog: BlogViewModel = createResponse.body;
    expect(createBlog).toEqual({
      id: expect.any(String),
      name: "supertest_01",
      description: "Data for constructing new Blog entity",
      websiteUrl: "https://www.youtube.com/watch?v=cHVhpNrjcPs&list=PLcvhF2Wqh7DP4tZ851CauQ8GqgqlCocjk",
      createdAt: expect.any(String)
    });
  });
});






