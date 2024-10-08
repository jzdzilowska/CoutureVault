/**
 * Defines the extent of an anchor in a document,
 * e.g. start / end characters in a text node.
 */
export type Extent =
  | ITextExtent
  | IImageExtent
  | IMediaExtent
  | IClothingExtent;

/** Defines the extent of an anchor on a text node */
export interface ITextExtent {
  endCharacter: number;
  startCharacter: number;
  text: string;
  type: "text";
}

/** Defines the extent of an anchor on an image node */
export interface IImageExtent {
  height: number;
  left: number;
  top: number;
  type: "image";
  width: number;
}

export interface IMediaExtent {
  type: "media";
  timestamp: number;
}

export interface IClothingExtent {
  type: "clothingitem";
}

export function makeITextExtent(
  text: string,
  startCharacter: number,
  endCharacter: number
) {
  return {
    endCharacter: endCharacter,
    startCharacter: startCharacter,
    text: text,
    type: "text" as const,
  };
}

export function makeIImageExtent(
  left?: number,
  top?: number,
  width?: number,
  height?: number
) {
  return {
    height: height ?? 1,
    left: left ?? 0,
    top: top ?? 1,
    type: "image" as const,
    width: width ?? 1,
  };
}

export function makeIMediaExtent(timestamp?: number) {
  return {
    type: "media" as const,
    timestamp: timestamp ?? 0,
  };
}

export function makeIClothingItemExtent() {
  return {
    type: "clothingitem" as const,
  };
}

export function isExtent(object: any): boolean {
  return (
    object === null ||
    isITextExtent(object) ||
    isIImageExtent(object) ||
    isIMediaExtent(object) ||
    isIClothingItemExtent(object)
  );
}

export function isITextExtent(object: any): boolean {
  const startCharacter = (object as ITextExtent).startCharacter;
  const endCharacter = (object as ITextExtent).endCharacter;
  const text = (object as ITextExtent).text;
  const correctTypes =
    (object as ITextExtent).type === "text" &&
    typeof text === "string" &&
    typeof startCharacter === "number" &&
    typeof endCharacter === "number";
  if (correctTypes) {
    // check that start and end character numbers are correct
    if (startCharacter < endCharacter) {
      return false;
    }
    // check that start and end character numbers match with text length
    if (endCharacter - startCharacter !== text.length) {
      return false;
    }
  }
  return true;
}

export function isIImageExtent(object: any): boolean {
  return (
    (object as IImageExtent).type === "image" &&
    typeof (object as IImageExtent).left === "number" &&
    typeof (object as IImageExtent).top === "number" &&
    typeof (object as IImageExtent).width === "number" &&
    typeof (object as IImageExtent).height === "number"
  );
}

export function isIMediaExtent(object: any): boolean {
  return (
    (object as IMediaExtent).type === "media" &&
    typeof (object as IMediaExtent).timestamp === "number"
  );
}

export function isIClothingItemExtent(object: any): boolean {
  return (object as IClothingExtent).type === "clothingitem";
}

export function isSameExtent(e1: Extent | null, e2: Extent | null): boolean {
  if (e1 == null && e2 == null) {
    return true;
  }
  return JSON.stringify(e1) === JSON.stringify(e2);
}
