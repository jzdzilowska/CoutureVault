import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { BackendNodeGateway } from "../../../nodes";
import {
  INode,
  makeINode,
  IComment,
  makeIComment,
  INodeProperty,
  makeINodeProperty,
} from "../../../types";

//unit test for commenting on node
describe("Unit Test: Comment Node", () => {
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
  });

  afterAll(async () => {
    await mongoClient.close();
    await mongoMemoryServer.stop();
  });

  test("comment on valid node", async () => {
    const validNode: INode = makeINode("1", ["1"]);
    const response = await backendNodeGateway.createNode(validNode);
    const comment: IComment = makeIComment("user", "hello", "today");
    const iNodeProp: INodeProperty = makeINodeProperty("comments", [comment]);
    const commentResponse = await backendNodeGateway.updateNode("1", [
      iNodeProp,
    ]);
    expect(response.success).toBeTruthy();
    expect(commentResponse.success).toBeTruthy();
    expect(response.payload).toStrictEqual(validNode);
  });

  test("multiple comments on valid node", async () => {
    const validNode: INode = makeINode("1", ["1"]);
    const response = await backendNodeGateway.createNode(validNode);
    const comment1: IComment = makeIComment("user", "hello", "today");
    const comment2: IComment = makeIComment("user1", "hello1", "today1");
    const iNodeProp: INodeProperty = makeINodeProperty("comments", [
      comment1,
      comment2,
    ]);
    const commentResponse = await backendNodeGateway.updateNode("1", [
      iNodeProp,
    ]);
    expect(response.success).toBeTruthy();
    expect(commentResponse.success).toBeTruthy();
    expect(response.payload).toStrictEqual(validNode);
  });

  test("multiple comments on clothingitem specific node", async () => {
    const validNode: INode = makeINode("1", ["1"], [], "clothingitem");
    const response = await backendNodeGateway.createNode(validNode);
    const comment1: IComment = makeIComment("user", "hello", "today");
    const comment2: IComment = makeIComment("user1", "hello1", "today1");
    const iNodeProp: INodeProperty = makeINodeProperty("comments", [
      comment1,
      comment2,
    ]);
    const commentResponse = await backendNodeGateway.updateNode("1", [
      iNodeProp,
    ]);
    expect(response.success).toBeTruthy();
    expect(commentResponse.success).toBeTruthy();
    expect(response.payload).toStrictEqual(validNode);
  });

  test("multiple comments on outfit specific node", async () => {
    const validNode: INode = makeINode("1", ["1"], [], "outfit");
    const response = await backendNodeGateway.createNode(validNode);
    const comment1: IComment = makeIComment("user", "hello", "today");
    const comment2: IComment = makeIComment("user1", "hello1", "today1");
    const iNodeProp: INodeProperty = makeINodeProperty("comments", [
      comment1,
      comment2,
    ]);
    const commentResponse = await backendNodeGateway.updateNode("1", [
      iNodeProp,
    ]);
    expect(response.success).toBeTruthy();
    expect(commentResponse.success).toBeTruthy();
    expect(response.payload).toStrictEqual(validNode);
  });
});
