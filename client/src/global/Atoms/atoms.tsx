import { atom } from "recoil";
import { INode, IAnchor, Extent, RecursiveNodeTree } from "../../types";
import { emptyNode } from "~/components/MainView/mainViewUtils";

// whether the app is loaded
export const isAppLoadedState = atom<boolean>({
  key: "isAppLoadedState",
  default: false,
});

// root nodes
export const rootNodesState = atom<RecursiveNodeTree[]>({
  key: "rootNodesState",
  default: [new RecursiveNodeTree(emptyNode)],
});

// the selected node
export const selectedNodeState = atom<INode | null>({
  key: "selectedNodeState",
  default: null,
});

// the current node, same as selected node unless selected node is null
export const currentNodeState = atom<INode>({
  key: "currentNodeState",
});

// Whether the app is playing
export const isPlayingState = atom<boolean>({
  key: "isPlayingState",
  default: false,
});

// whether a link is in progress
export const isLinkingState = atom<boolean>({
  key: "isLinkingState",
  default: false,
});

// signal to refresh webpage
export const refreshState = atom<boolean>({
  key: "refreshState",
  default: false,
});

// signal to refresh anchors
export const refreshAnchorState = atom<boolean>({
  key: "refreshAnchorState",
  default: false,
});

// signal to refresh anchors
export const refreshLinkListState = atom<boolean>({
  key: "refreshLinkListState",
  default: false,
});

// start anchor for link
export const startAnchorState = atom<IAnchor | null>({
  key: "startAnchorState",
  default: null,
});

// end anchor for link
export const endAnchorState = atom<IAnchor | null>({
  key: "endAnchorState",
  default: null,
});

// selected anchor(s)
export const selectedAnchorsState = atom<IAnchor[]>({
  key: "selectedAnchorsState",
  default: [],
});

// selected extent
export const selectedExtentState = atom<Extent | null | undefined>({
  key: "selectedExtentState",
  default: null,
});

// whether alert is open
export const alertOpenState = atom<boolean>({
  key: "alertOpenState",
  default: false,
});

// alert title
export const alertTitleState = atom<string>({
  key: "alertTitleState",
  default: "",
});

// alert message
export const alertMessageState = atom<string>({
  key: "alertMessageState",
  default: "",
});

// landing page
export const landingState = atom<boolean>({
  key: "landingState",
  default: true,
});

// Whether the app is playing
export const loggedInState = atom<boolean>({
  key: "loggedInState",
  default: false,
});

// Any new comments state
export const anyNewCommentsState = atom<boolean>({
  key: "anyNewCommentsState",
  default: false,
});

// User session state
export const userSessionState = atom({
  key: "userSessionState",
  default: {
    name: "anonymous",
    email: "unprovided",
  },
});
