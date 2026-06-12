const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe("Auth endpoints", () => {
  const userData = {
    name: "Elian Muñoz",
    email: "elian@test.com",
    password: "123456",
  };

  test("POST /api/auth/register - debe registrar un usuario", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(typeof res.body.data.token).toBe("string");
    expect(res.body.data.user.email).toBe(userData.email);
    expect(res.body.data.user.password).toBeUndefined();
  });

  test("POST /api/auth/register - falla con email duplicado", async () => {
    await request(app)
      .post("/api/auth/register")
      .send(userData);

    const res = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(res.status).toBe(409);
    expect(res.body.status).toBe("error");
  });

  test("POST /api/auth/login - login correcto", async () => {
    await request(app)
      .post("/api/auth/register")
      .send(userData);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(typeof res.body.data.token).toBe("string");
  });

  test("POST /api/auth/login - falla con password incorrecta", async () => {
    await request(app)
      .post("/api/auth/register")
      .send(userData);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: "passwordIncorrecta",
      });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe("error");
  });

  test("POST /api/auth/register - falla con datos inválidos (Zod)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "A",
        email: "no-es-email",
        password: "123",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});