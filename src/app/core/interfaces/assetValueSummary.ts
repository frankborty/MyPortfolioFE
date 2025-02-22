export interface AssetValueSummary {
  asset: AssetSimple;
  assetValueList: AssetValueList[];
}

export interface AssetValueList {
  id: number;
  assetId: number;
  value: number;
  timeStamp: string;
}

export interface AssetSimple {
  name: string;
  assetCategory: AssetCategory;
}

export interface AssetCategory {
  id: number;
  name: string;
  isInvested: boolean;
}