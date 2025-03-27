import { AssetCategory } from "./assetCategory";

export interface Asset {
  id: number;
  name: string;
  isin: string;
  pyName: string;
  note: string;
  share: number;
  url: string;
  pmc: number;
  currentValue: number;
  timeStamp: Date;
  category: AssetCategory;
}



