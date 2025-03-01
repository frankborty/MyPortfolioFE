import { AssetCategory } from "./assetCategory";

export interface AssetValueSummary {
  asset: AssetSimple;
  assetValueList: AssetValueList[];
}

export interface AssetValueList {
  id: number;
  assetId: number;
  value: number;
  note: string;
  timeStamp: string;
}

export interface AssetSimple {
  id: number;
  name: string;
  category: AssetCategory;
}
