import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { UsersViewType } from "../src/modules/users/infrastructure/query-reposirory/user-View-Model";
import { createdApp } from "../src/helpers/createdApp";
import { BlogViewForSaModel } from "../src/modules/blogs/infrastructure/query-repository/blog-View-Model";




jest.setTimeout(120000);

describe("Admin endpoints (e2e)", () => {

  let app: INestApplication;
  //let mongoServer: MongoMemoryServer;
  //let blogsController: BlogsController;
  // let paginationInputModel: PaginationDto = new PaginationDto();
  //let blogsQueryRepositories: BlogsQueryRepositories

  beforeAll(async () => {
    // Create a NestJS application
    const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] })
      // .overrideProvider()
      .compile();
    app = module.createNestApplication();
    //created me
    app = createdApp(app);
    //blogsController = app.get<BlogsController>(BlogsController);
    //blogsQueryRepositories = app.get<BlogsQueryRepositories>(BlogsQueryRepositories);
    // Connect to the in-memory server
    await app.init();
    //Create a new MongoDB in-memory server
    //mongoServer = await MongoMemoryServer.create();
    //const mongoUri = mongoServer.getUri();
    // Get the connection string for the in-memory server
    //await mongoose.connect(mongoUri);
  });
  afterAll(async () => {
    await app.close();
    //await mongoose.disconnect();
    //await mongoServer.stop();
  });


  describe(`/sa`, () => {

    beforeAll(async () => {
      await request(app.getHttpServer())
        .delete(`/testing/all-data`).expect(204);
    });
    let createdUser: UsersViewType;
    let blogs: BlogViewForSaModel;
    it(`01 - POST -> "/users": should create new user; status 201; content: created user; used additional methods: GET => /users`, async () => {
      const response = await request(app.getHttpServer())
        .post(`/sa/users`)
        .auth("admin", "qwerty", { type: "basic" })
        .send({ login: "asirius", password: "asirius321", email: "asirius@jive.com" })
        .expect(201);
      createdUser = response.body; //first user
      expect(createdUser).toEqual({
        id: expect.any(String),
        login: "asirius",
        email: "asirius@jive.com",
        createdAt: expect.any(String),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null
        }
      });
    });

    it(`02-GET -> "/sa/blogs": should be return all blogs (array[]) wit pagination`, async () => {
      let resultView = {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      };
      //jest.spyOn(blogsQueryRepositories, "findBlogs").mockImplementation(() => result);
      const responseBlog = await request(app.getHttpServer())
        .get(`/blogs`)
        .auth("admin", "qwerty", { type: "basic" })
        .expect(200);
      blogs = responseBlog.body;
      expect(blogs).toStrictEqual(resultView);
    });
    it(`03 - GET -> "/users": should return status 200; content: users array with pagination; used additional methods: POST -> /users, DELETE -> /users;`, async () => {
      const response = await request(app.getHttpServer())
        .post("/sa/users")
        .auth("admin", "qwerty", { type: "basic" })
        .send({ login: "asirius2", password: "asirius2321", email: "asirius2@jive.com" })
        .expect(201);
      createdUser = response.body  //second user
      await request(app.getHttpServer())
        .delete(`/sa/users/${createdUser.id}`)
        .auth("admin", "qwerty", { type: "basic" })
        .expect(204);

      const response2 = await request(app.getHttpServer())
        .get(`/sa/users`)
        .auth("admin", "qwerty", { type: "basic" })
        .expect(200);

      const modelUsers = response2.body as { items: UsersViewType[] };
      let resultView = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [expect.any(Object)]
      };
      expect(modelUsers).toEqual(resultView);
      expect(modelUsers.items.length).toBe(1);
    });

    it(`04 - POST, DELETE -> "/users": should return error if auth credentials is incorrect; status 401; used additional methods: POST -> /users;`, async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`/sa/users`)
        .auth("admin", "qwerty", { type: "basic" })
        .send({ login: "asirius2", password: "asirius2321", email: "asirius2@jive.com" })
        .expect(201);
      await request(app.getHttpServer())
        .delete(`/sa/users/${createResponse.body.id}`)
        .auth("admin", "123", { type: "basic" })
        .expect(401, "Unauthorized");
    });
    it(`05 - DELETE -> "/users/:id": should delete user by id; status 204; used additional methods: POST -> /users, GET -> /users`, async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`/sa/users`)
        .auth("admin", "qwerty", { type: "basic" })
        .send({ login: "asirius22", password: "asirius2321", email: "asirius22@jive.com" })
        .expect(201);
      createdUser = createResponse.body
      await request(app.getHttpServer())
        .get(`/sa/users`)
        .auth("admin", "qwerty", { type: "basic" })
        .expect(200)

      await request(app.getHttpServer())
        .delete(`/sa/users/${createdUser.id}`)
        .auth("admin", "qwerty", { type: "basic" })
        .expect(204)

    })

  });


});






