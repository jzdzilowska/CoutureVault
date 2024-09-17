import {
  INode,
  makeINode,
  makeINodeProperty,
  isSameNode,
  INodeProperty,
} from "../../../types";
import { BackendNodeGateway } from "../../../nodes";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("Unit Test: Update Node", () => {
  let uri: string;
  let mongoClient: MongoClient;
  let backendNodeGateway: BackendNodeGateway;
  let mongoMemoryServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    uri = mongoMemoryServer.getUri();
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    backendNodeGateway = new BackendNodeGateway(mongoClient);
    mongoClient.connect();
  });

  beforeEach(async () => {
    const response = await backendNodeGateway.deleteAll();
    expect(response.success).toBeTruthy();
    const validNode1: INode = makeINode("1", ["1"]);
    const response1 = await backendNodeGateway.createNode(validNode1);
    expect(response1.success).toBeTruthy();
  });

  afterAll(async () => {
    await mongoClient.close();
    await mongoMemoryServer.stop();
  });

  test("successfully updates clothingitem node's fields", async () => {
    const updateResp = await backendNodeGateway.updateNode("1", [
      makeINodeProperty("type", "clothingitem"),
      makeINodeProperty("content", "new content"),
      makeINodeProperty("title", "new title"),
      makeINodeProperty("brand", "new brand"),
      makeINodeProperty("color", "new color"),
      makeINodeProperty("description", "new description"),
      makeINodeProperty("price", 10),
    ]);
    expect(updateResp.success).toBeTruthy();
    expect(updateResp.payload.content === "new content").toBeTruthy();
    const findNodeByIdResp = await backendNodeGateway.getNodeById("1");
    expect(findNodeByIdResp.payload.content === "new content").toBeTruthy();
    expect(findNodeByIdResp.payload.type === "clothingitem").toBeTruthy();
    expect(findNodeByIdResp.payload.title === "new title").toBeTruthy();
    expect(findNodeByIdResp.payload.brand === "new brand").toBeTruthy();
    expect(findNodeByIdResp.payload.color === "new color").toBeTruthy();
    expect(
      findNodeByIdResp.payload.description === "new description"
    ).toBeTruthy();
    expect(findNodeByIdResp.payload.price === 10).toBeTruthy();
  });

  test("successfully updates outfit node's fields", async () => {
    const updateResp = await backendNodeGateway.updateNode("1", [
      makeINodeProperty("type", "outfit"),
      makeINodeProperty("content", "new content"),
      makeINodeProperty("title", "new title"),
      makeINodeProperty("description", "new description"),
    ]);
    expect(updateResp.success).toBeTruthy();
    expect(updateResp.payload.content === "new content").toBeTruthy();
    const findNodeByIdResp = await backendNodeGateway.getNodeById("1");
    expect(findNodeByIdResp.payload.content === "new content").toBeTruthy();
    expect(findNodeByIdResp.payload.type === "outfit").toBeTruthy();
    expect(findNodeByIdResp.payload.title === "new title").toBeTruthy();
    expect(
      findNodeByIdResp.payload.description === "new description"
    ).toBeTruthy();
  });

  test("fails to update node when field name is incorrect", async () => {
    const updateResp = await backendNodeGateway.updateNode("1", [
      { fieldName: "asdf", value: "new content" } as unknown as INodeProperty,
    ]);
    expect(updateResp.success).toBeFalsy();
    const findNodeByIdResp = await backendNodeGateway.getNodeById("1");
    expect(
      isSameNode(findNodeByIdResp.payload, makeINode("1", ["1"]))
    ).toBeTruthy();
  });

  test(
    "fails to update node when field value " + "is incorrect type",
    async () => {
      const updateResp = await backendNodeGateway.updateNode("1", [
        { fieldName: "price", value: "not a number" },
      ]);
      expect(updateResp.success).toBeFalsy();
      const findNodeByIdResp = await backendNodeGateway.getNodeById("1");
      expect(
        isSameNode(findNodeByIdResp.payload, makeINode("1", ["1"]))
      ).toBeTruthy();
    }
  );

  test("fails to update node with impossible filePath", async () => {
    const updateResp = await backendNodeGateway.updateNode("1", [
      { fieldName: "filePath", value: ["1", "2"] },
    ]);
    expect(updateResp.success).toBeFalsy();
    const findNodeByIdResp = await backendNodeGateway.getNodeById("1");
    expect(
      isSameNode(findNodeByIdResp.payload, makeINode("1", ["1"]))
    ).toBeTruthy();
  });
});
