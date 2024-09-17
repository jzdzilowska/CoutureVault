[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/G1bzI2ur)

# Final Project

CoutureVault

# Team Members

Julia Zdzilowska, Kayla Mukai, and Lucy Nguyen

# Project Summary

Our final project envisions the creation of an innovative online platform that serves as a dual-purpose hub for fashion enthusiasts. The platform aims to inspire users by providing a space for sharing outfits and gaining insights from others' style choices. Users can also contribute to the platform by uploading their own outfits, creating a personalized wardrobe-like view for easy access.

The core of the platform's node hierarchy revolves around "Clothing" nodes, each representing a single apparel item. These nodes include essential fields such as type (categorized into standardized options like top, bottom, shoes, accessories, outerwear), brand, color, and price. Complementing this, "Outfit" nodes are designed to aggregate and showcase collections of associated Clothing nodes. They also feature metadata such as user-defined categories such as title, description, and summation of price based on the prices of individual clothing items.

# Project Features

- Posting and deleting one's own outifits/clothing item posts with specificed CoutureVault details. For outfits, you would add a description and clothingItems nodes so our sumPrice methods can add up all the prices of the clothingItems nodes and display it below the description. For clothing items, you would add the brand, color, price, and description.
- Searching through (filtering) individual clothing items in wardrobe view (based on clothing node fields).
- Commenting on others’ outfits with user Authenciaiton
- Users can log-in
- Authenciation System when users input values for outfit/clothingItem 

# Design Decisions

- New Node Types: Our new node types are Outfit and Clothing nodes. Each of these node types have different metadata fields that the user can input. Outfit nodes contain Clothing nodes and calculate the sum of prices of the Clothing nodes within them.
- Global Features: User authentication and commenting

## Getting started

The frontend can be found in `client/` and the backend can be found in `server/`.
They are separate projects and must be run separately (in different terminals).

The server requires environment variables to be set. See `server/.env.example` for
the required environment variables (copy this file to `.env` and fill in the values).

For each project, you can run the following commands:

- `npm install` to install dependencies
- `npm run dev` to run the development server
  Runs the app in the development mode.\
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

- `npm run lint` to run the linter
- `npm run test` to run tests (backend only)

## Deployed Backend URL

## Deployed Frontend URL

## Known Bugs

We have no known bugs!

## Notes

## Estimated Hours Taken

## Files Changed/Edited

FilteringBar.tsx
SearchBar.tsx
SearchView.tsx
SortingBar.tsx
INode.tsx (frontend and backend)
CommentForm.tsx
Comments.tsx
CommentsUtils.tsx
LandingScreen.tsx
LoadingScreen.tsx
LoginPage.tsx
MainView.tsx
CreateNodeModal.tsx
createNodeUtils.tsx
ClothingContent.tsx
FolderContent.tsx
MediaContent.tsx
NodeContent.tsx
globalUtils.tsx
FrontendNodeGateaway.tsx
[[...nodeId]].tsx
Login.tsx
INodeProperty.tsx
BackendNodeGateaway.tsx
NodeCollectionConnecton.tsx
NodeRouter.tsx
