import { AssetCategory } from "./assetCategory";

export interface Asset {
  id: number;
  name: string;
  isin: string;
  note: string;
  share: number;
  url: string;
  avgPrice: number;
  timeStamp: string;
  category: AssetCategory;
}



