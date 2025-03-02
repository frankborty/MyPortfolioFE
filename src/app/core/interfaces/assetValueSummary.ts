import { Asset } from "./asset";
import { AssetCategory } from "./assetCategory";

export interface AssetValueSummary {
  asset: Asset;
  assetValueList: AssetValueList[];
}

export interface AssetValueList {
  id: number;
  assetId: number;
  value: number;
  note: string;
  timeStamp: string;
}


