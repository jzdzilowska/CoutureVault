import { MongoClient } from "mongodb";
import { BackendNodeGateway } from "../../../nodes";
import {
  INode,
  IServiceResponse,
  makeINodePath,
  makeINodeProperty,
  NodeType,
} from "../../../types";
import uniqid from "uniqid";

jest.setTimeout(50000);

describe("E2E Test: Node CRUD", () => {
  let mongoClient: MongoClient;
  let backendNodeGateway: BackendNodeGateway;
  let uri: string;
  let collectionName: string;

  function generateNodeId(type: NodeType) {
    return uniqid(type + ".");
  }

  const testNodeId = generateNodeId("clothingitem");
  const testNode: INode = {
    nodeId: testNodeId,
    title: "test.title",
    filePath: makeINodePath([testNodeId]),
    content: "test.content",
    type: "clothingitem",
    clothingType: "shirt",
    color: "black",
    description: "this is a description",
    brand: "brand",
    price: 10,
  };

  beforeAll(async () => {
    uri = process.env.DB_URI;
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    collectionName = "e2e-test-nodes";
    backendNodeGateway = new BackendNodeGateway(mongoClient, collectionName);
    await mongoClient.connect();

    const getResponse = await backendNodeGateway.getNodeById(testNode.nodeId);
    expect(getResponse.success).toBeFalsy();
  });

  afterAll(async () => {
    await mongoClient.db().collection(collectionName).drop();
    const getResponse = await backendNodeGateway.getNodeById(testNode.nodeId);
    expect(getResponse.success).toBeFalsy();
    await mongoClient.close();
  });

  test("creates node", async () => {
    const response = await backendNodeGateway.createNode(testNode);
    expect(response.success).toBeTruthy();
  });

  test("retrieves node", async () => {
    const response = await backendNodeGateway.getNodeById(testNode.nodeId);
    expect(response.success).toBeTruthy();
    expect(response.payload.nodeId).toEqual(testNode.nodeId);
    expect(response.payload.content).toEqual(testNode.content);
    //new metadata
    expect(response.payload.price).toEqual(testNode.price);
    expect(response.payload.clothingType).toEqual(testNode.clothingType);
  });

  //update node with new metadata fields
  test("updates node", async () => {
    const updateResp = await backendNodeGateway.updateNode(testNodeId, [
      makeINodeProperty("price", 5),
      makeINodeProperty("clothingType", "skirt"),
      makeINodeProperty("brand", "new brand"),
    ]);
    expect(updateResp.success).toBeTruthy();
  });

  test("deletes node", async () => {
    const deleteResponse = await backendNodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse = await backendNodeGateway.getNodeById(testNode.nodeId);
    expect(getResponse.success).toBeFalsy();
  });
});

describe("E2E Test: File Structure Validity", () => {
  let mongoClient: MongoClient;
  let backendNodeGateway: BackendNodeGateway;
  let uri: string;
  let collectionName: string;

  function generateNodeId(type: NodeType) {
    return uniqid(type + ".");
  }

  const testOutfitNodeId = generateNodeId("outfit");
  const testOutfit2NodeId = generateNodeId("outfit");
  const testNodeId = generateNodeId("clothingitem");
  const testNestedNodeId = generateNodeId("clothingitem");

  const testOutfit: INode = {
    nodeId: testOutfitNodeId,
    title: "test.title.testOutfit",
    filePath: makeINodePath([testOutfitNodeId]),
    content: "test.content.testOutfit",
    type: "outfit",
  };

  const testOutfit2: INode = {
    nodeId: testOutfit2NodeId,
    title: "test.title.testOutfit2",
    filePath: makeINodePath([testOutfitNodeId, testOutfit2NodeId]),
    content: "test.content.testOutfit2",
    type: "outfit",
  };

  const testNode: INode = {
    nodeId: testNodeId,
    title: "test.title.testNode",
    filePath: makeINodePath([testOutfitNodeId, testNodeId]),
    content: "test.content.testNode",
    type: "clothingitem",
    clothingType: "pants",
    price: 5,
    color: "brown",
    description: "this is a description!!!",
    brand: "this brand",
  };

  const testNestedNode: INode = {
    nodeId: testNestedNodeId,
    title: "test.title.testNestedNode",
    filePath: makeINodePath([
      testOutfitNodeId,
      testOutfit2NodeId,
      testNestedNodeId,
    ]),
    content: "test.content.testNestedNode",
    type: "clothingitem",
    clothingType: "dress",
    price: 7,
  };

  beforeAll(async () => {
    uri = process.env.DB_URI;
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    collectionName = "e2e-test-nodes";
    backendNodeGateway = new BackendNodeGateway(mongoClient, collectionName);
    await mongoClient.connect();

    // testing file structure:
    // testOutfit
    //   | - testNode
    //   | - testOutfit2
    //      | - testNestedNode

    // create folder should be successful
    await backendNodeGateway.createNode(testOutfit);
    await backendNodeGateway.createNode(testOutfit2);
    await backendNodeGateway.createNode(testNode);
    await backendNodeGateway.createNode(testNestedNode);

    // get should be successful and contain new folder
    const getResponse = await backendNodeGateway.getNodeById(testOutfit.nodeId);
    expect(getResponse.success).toBeTruthy();

    const getResponse2 = await backendNodeGateway.getNodeById(
      testOutfit2.nodeId
    );
    expect(getResponse2.success).toBeTruthy();

    const getResponse3 = await backendNodeGateway.getNodeById(testNode.nodeId);
    expect(getResponse3.success).toBeTruthy();

    const getResponse4 = await backendNodeGateway.getNodeById(
      testNestedNode.nodeId
    );
    expect(getResponse4.success).toBeTruthy();
  });

  afterAll(async () => {
    const deleteResponse = await backendNodeGateway.deleteNode(
      testNestedNode.nodeId
    );
    expect(deleteResponse.success).toBeTruthy();

    const deleteResponse1 = await backendNodeGateway.deleteNode(
      testOutfit2.nodeId
    );
    expect(deleteResponse1.success).toBeTruthy();

    const deleteResponse2 = await backendNodeGateway.deleteNode(
      testOutfit.nodeId
    );
    expect(deleteResponse2.success).toBeTruthy();

    // get should be successful and contain new folder
    const getResponse = await backendNodeGateway.getNodeById(
      testNestedNode.nodeId
    );
    expect(getResponse.success).toBeFalsy();

    const getResponse1 = await backendNodeGateway.getNodeById(
      testOutfit2.nodeId
    );
    expect(getResponse1.success).toBeFalsy();

    const getResponse2 = await backendNodeGateway.getNodeById(
      testOutfit.nodeId
    );
    expect(getResponse2.success).toBeFalsy();

    const getResponse3 = await backendNodeGateway.getNodeById(testNode.nodeId);
    expect(getResponse3.success).toBeFalsy();
    await mongoClient.db().collection(collectionName).drop();
    await mongoClient.close();
  });

  test("gets correct file tree", async () => {
    const response: IServiceResponse<INode> =
      await backendNodeGateway.getNodeById(testOutfit.nodeId);

    expect(response.success).toBeTruthy();
    expect(response.payload.nodeId).toEqual(testOutfit.nodeId);
    expect(response.payload.filePath.children.length).toEqual(2);

    const response2: IServiceResponse<INode> =
      await backendNodeGateway.getNodeById(testOutfit2.nodeId);
    expect(response2.success).toBeTruthy();
    expect(response2.payload.nodeId).toEqual(testOutfit2.nodeId);
    expect(response2.payload.filePath.children.length).toEqual(1);

    const response3: IServiceResponse<INode> =
      await backendNodeGateway.getNodeById(testNode.nodeId);
    expect(response3.success).toBeTruthy();
    expect(response3.payload.nodeId).toEqual(testNode.nodeId);
    expect(response3.payload.filePath.children.length).toEqual(0);
  });

  test("correctly moves folder in tree", async () => {
    // get should be successful and contain new folder
    const getResponse1 = await backendNodeGateway.getNodeById(
      testOutfit2.nodeId
    );
    expect(getResponse1.success).toBeTruthy();
    expect(getResponse1.payload.filePath.children.length).toEqual(1);
    expect(getResponse1.payload.filePath.children[0]).toEqual(
      testNestedNode.nodeId
    );

    const moveResponse = await backendNodeGateway.moveNode(
      testNestedNode.nodeId,
      testOutfit.nodeId
    );

    expect(moveResponse.success).toBeTruthy();

    // get should be successful and contain new folder
    const getResponse2 = await backendNodeGateway.getNodeById(
      testOutfit.nodeId
    );
    expect(getResponse2.success).toBeTruthy();
    expect(getResponse2.payload.filePath.children.length).toEqual(3);
  });
});
