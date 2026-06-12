const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const res = await request(app).post("/api/auth/register").send({
    name: "Autor Test",
    email: "autor@test.com",
    password: "123456",
  });
  token = res.body.data.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Post endpoints", () => {
  let createdSlug;

  test("POST /api/posts - falla sin token", async () => {
    const res = await request(app).post("/api/posts").send({
      title: "Mi primer post de prueba",
      content: "Contenido de prueba con suficiente longitud",
    });

    expect(res.status).toBe(401);
  });

  test("POST /api/posts - crea un post con token válido", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mi primer post de prueba",
        content: "Contenido de prueba con suficiente longitud",
        status: "published",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBeDefined();
    createdSlug = res.body.data.slug;
  });

  test("GET /api/posts - lista posts publicados", async () => {
    const res = await request(app).get("/api/posts");

    expect(res.status).toBe(200);
    expect(res.body.data.posts.length).toBeGreaterThan(0);
    expect(res.body.data.pagination).toBeDefined();
  });

  test("GET /api/posts/:slug - obtiene post por slug", async () => {
    const res = await request(app).get(`/api/posts/${createdSlug}`);

    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe(createdSlug);
  });

  test("PATCH /api/posts/:slug - actualiza el post propio", async () => {
    const res = await request(app)
      .patch(`/api/posts/${createdSlug}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Titulo actualizado de prueba" });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Titulo actualizado de prueba");
  });

  test("DELETE /api/posts/:slug - elimina el post propio", async () => {
    const res = await request(app)
      .patch(`/api/posts/${createdSlug}`)
      .set("Authorization", `Bearer ${token}`);

    const del = await request(app)
      .delete(`/api/posts/${createdSlug}`)
      .set("Authorization", `Bearer ${token}`);

    expect(del.status).toBe(204);
  });
});