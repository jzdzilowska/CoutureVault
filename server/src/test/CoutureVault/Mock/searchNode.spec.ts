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

describe("Unit Test: Search Node", () => {
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
    const validNode1: INode = makeINode(
      "1",
      ["1"],
      [],
      "clothingitem",
      "test title",
      "test content"
    );
    const response1 = await backendNodeGateway.createNode(validNode1);
    expect(response1.success).toBeTruthy();
  });

  afterAll(async () => {
    await mongoClient.close();
    await mongoMemoryServer.stop();
  });

  test("error searching clothingitem node's fields", async () => {
    const searchResp = await backendNodeGateway.search("not searchable");
    expect(searchResp.success).toBeFalsy();
  });
});
