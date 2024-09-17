import {
  INode,
  isINode,
  IServiceResponse,
  failureServiceResponse,
  successfulServiceResponse,
  makeINodePath,
  isINodePath,
  IComment,
} from "../types";
import { MongoClient } from "mongodb";

/**
 * NodeCollectionConnection acts as an in-between communicator between
 * the MongoDB database and BackendNodeGateway. NodeCollectionConnection
 * defines methods that interact directly with MongoDB. That said,
 * it does not include any of the complex logic that BackendNodeGateway has.
 *
 * For example:
 * NodeCollectionConnection.deleteNode() will only delete a single node.
 * BackendNodeGateway.deleteNode() deletes all its children from the database
 * as well.
 *
 * @param {MongoClient} client
 * @param {string} collectionName
 */
export class NodeCollectionConnection {
  client: MongoClient;
  collectionName: string;

  constructor(mongoClient: MongoClient, collectionName?: string) {
    this.client = mongoClient;
    this.collectionName = collectionName ?? "nodes";
    this.createTextIndex(); // the method to connect client and create Text Index is called
  }

  async getNodeById(nodeId: string): Promise<INode | null> {
    try {
      const node = await this.client
        .db()
        .collection(this.collectionName)
        .findOne({ nodeId: nodeId });

      return node;
    } catch (error) {
      console.error("Error fetching node by ID:", error);
      return error;
    }
  }

  /**
   * Inserts a new node into the database
   * Returns successfulServiceResponse with INode that was inserted as the payload
   *
   * @param {INode} node
   * @return successfulServiceResponse<INode>
   */
  async insertNode(node: INode): Promise<IServiceResponse<INode>> {
    if (!isINode(node)) {
      return failureServiceResponse(
        "Failed to insert node due to improper input " +
          "to nodeCollectionConnection.insertNode"
      );
    }
    const insertResponse = await this.client
      .db()
      .collection(this.collectionName)
      .insertOne(node);
    if (insertResponse.insertedCount) {
      return successfulServiceResponse(insertResponse.ops[0]);
    }
    return failureServiceResponse(
      "Failed to insert node, insertCount: " + insertResponse.insertedCount
    );
  }

  /**
   * Clears the entire node collection in the database.
   *
   * @return successfulServiceResponse on success
   *         failureServiceResponse on failure
   */
  async clearNodeCollection(): Promise<IServiceResponse<null>> {
    const response = await this.client
      .db()
      .collection(this.collectionName)
      .deleteMany({});
    if (response.result.ok) {
      return successfulServiceResponse(null);
    }
    return failureServiceResponse("Failed to clear node collection.");
  }

  /**
   * Clears the entire node collection in the database.
   *
   * @param {string} nodeId
   * @return successfulServiceResponse<INode> on success
   *         failureServiceResponse on failure
   */
  async findNodeById(nodeId: string): Promise<IServiceResponse<INode>> {
    const findResponse = await this.client
      .db()
      .collection(this.collectionName)
      .findOne({ nodeId: nodeId });
    if (findResponse == null) {
      return failureServiceResponse("Failed to find node with this nodeId.");
    } else {
      return successfulServiceResponse(findResponse);
    }
  }

  /**
   * Finds nodes when given a list of nodeIds.
   * Returns successfulServiceResponse with empty array when no nodes found.
   *
   * @param {string[]} nodeIds
   * @return successfulServiceResponse<INode[]>
   */
  async findNodesById(nodeIds: string[]): Promise<IServiceResponse<INode[]>> {
    const foundNodes: INode[] = [];
    await this.client
      .db()
      .collection(this.collectionName)
      .find({ nodeId: { $in: nodeIds } })
      .forEach(function (doc) {
        foundNodes.push(doc);
      });
    return successfulServiceResponse(foundNodes);
  }

  /**
   * Updates node when given a nodeId and a set of properties to update.
   *
   * @param {string} nodeId
   * @param {Object} properties to update in MongoDB
   * @return successfulServiceResponse<INode> on success
   *         failureServiceResponse on failure
   */
  async updateNode(
    nodeId: string,
    updatedProperties: Record<string, unknown>
  ): Promise<IServiceResponse<INode>> {
    const updateResponse = await this.client
      .db()
      .collection(this.collectionName)
      .findOneAndUpdate(
        { nodeId: nodeId },
        { $set: updatedProperties },
        { returnDocument: "after" }
      );
    if (updateResponse.ok && updateResponse.lastErrorObject.n) {
      return successfulServiceResponse(updateResponse.value);
    }
    return failureServiceResponse(
      "Failed to update node, lastErrorObject: " +
        updateResponse.lastErrorObject.toString()
    );
  }

  /**
   * Deletes node with the given nodeId.
   *
   * @param {string} nodeId
   * @return successfulServiceResponse<null> on success
   *         failureServiceResponse on failure
   */
  async deleteNode(nodeId: string): Promise<IServiceResponse<null>> {
    const collection = await this.client.db().collection(this.collectionName);
    const deleteResponse = await collection.deleteOne({ nodeId: nodeId });
    if (deleteResponse.result.ok) {
      return successfulServiceResponse(null);
    }
    return failureServiceResponse("Failed to delete");
  }

  /**
   * Deletes nodes when given a list of nodeIds.
   *
   * @param {string[]} nodeIds
   * @return successfulServiceResponse<null> on success
   *         failureServiceResponse on failure
   */
  async deleteNodes(nodeIds: string[]): Promise<IServiceResponse<null>> {
    const collection = await this.client.db().collection(this.collectionName);
    const myquery = { nodeId: { $in: nodeIds } };
    const deleteResponse = await collection.deleteMany(myquery);
    if (deleteResponse.result.ok) {
      return successfulServiceResponse(null);
    }
    return failureServiceResponse("Failed to update nodes");
  }

  /**
   * Find roots from database. Roots are defined as nodes with no parent.
   * Returns empty array when no roots found.
   *
   * @return successfulServiceResponse<INode[]>
   */
  async findRoots(): Promise<IServiceResponse<INode[]>> {
    const roots: INode[] = [];
    await this.client
      .db()
      .collection(this.collectionName)
      .find({ "filePath.path": { $size: 1 } })
      .forEach(function (node) {
        const validNode = isINode(node);
        if (validNode) {
          roots.push(node);
        }
      });
    return successfulServiceResponse(roots);
  }

  /**
   * Update the path of given node.
   *
   * @param {string} nodeId
   * @param {string[]} newPath
   * @return successfulServiceResponse<null>
   */
  async updatePath(
    nodeId: string,
    newPath: string[]
  ): Promise<IServiceResponse<null>> {
    if (
      !isINodePath(makeINodePath(newPath)) ||
      newPath[newPath.length - 1] !== nodeId
    ) {
      return failureServiceResponse(
        "newPath in nodeCollectionConnection is invalid"
      );
    }
    const updatePathResp = await this.client
      .db()
      .collection(this.collectionName)
      .findOneAndUpdate(
        { nodeId: nodeId },
        { $set: { "filePath.path": newPath } }
      );
    if (updatePathResp.ok && updatePathResp.lastErrorObject.n) {
      return successfulServiceResponse(null);
    }
    return failureServiceResponse(
      "Failed to update node " + nodeId + " filePath.path"
    );
  }

  /**
   * This function creates a text index for the MongoDB collection for the searching functionality.
   * If the index exists already, it's dropped before creating a new one.
   * @private
   */

  private async createTextIndex() {
    try {
      // Connect to MongoDB if not already connected
      if (!this.client.isConnected()) {
        await this.client.connect();
        console.log("Connected to MongoDB");
      }

      // Check if the text index already exists
      const indexes = await this.client
        .db()
        .collection(this.collectionName)
        .indexInformation();

      if (indexes.hasOwnProperty("node.title_text_node.content_text")) {
        // Drop the existing index
        await this.client
          .db()
          .collection(this.collectionName)
          .dropIndex("node.content_text_node.content_text");
        console.log("Dropped existing text index");
      }

      // Create the new text index
      await this.client.db().collection(this.collectionName).createIndex(
        {
          title: "text",
          content: "text",
        },
        { name: "textIndex" }
      );
      console.log("Text index created");
    } catch (error) {
      console.error("Error creating text index:", error);
    }
  }

  /**
   * This function performs searching for nodes in the MongoDB collection based on a search term.
   * @param searchTerm
   * @returns {Promise<IServiceResponse<INode[]>>}
   */

  async searchNode(searchTerm: string): Promise<IServiceResponse<INode[]>> {
    try {
      console.log("Searching for term:", searchTerm);
      // Logs the search query parameters
      console.log("Search query:", {
        $text: {
          $search: searchTerm,
          $caseSensitive: false,
          $diacriticSensitive: false,
        },
      });

      // Perform the text search using MongoDB's $text operator
      const searchResults = await this.client
        .db()
        .collection(this.collectionName)
        .find({
          $text: {
            $search: searchTerm,
            $caseSensitive: false,
            $diacriticSensitive: false,
          },
        })
        .project({
          score: { $meta: "textScore" }, // score from mongodb search functionality is incoporated

          // Can include other fields you want in the result
        })
        .sort({ score: { $meta: "textScore" } })
        .toArray();

      console.log("Search results:", searchResults);
      // Maps MongoDB documents to INode format
      const mappedResults: INode[] = searchResults.map((doc: any) => {
        return {
          nodeId: doc.nodeId,
          title: doc.title,
          content: doc.content,
        } as INode;
      });

      // Returns a failure response if no matching nodes are found
      // if (searchResults.length === 0) {
      //   return failureServiceResponse("No matching nodes found.");
      // }
      console.log("Mapped results:", mappedResults);

      // Returns a successful service response with the search results
      return successfulServiceResponse(searchResults);
    } catch (e) {
      // Handles errors and returns a failure service response
      console.error(e);
      return failureServiceResponse(e.message);
    }
  }
}
