import { AssetCategory } from "./assetCategory";

export interface Asset {
  id: number;
  name: string;
  isin: string;
  note: string;
  share: number;
  url: string;
  pmc: number;
  timeStamp: string;
  category: AssetCategory;
}



