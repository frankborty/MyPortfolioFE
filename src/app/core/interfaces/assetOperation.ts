export interface AssetOperation {
  assetOperationId: number,
  assetId: number;
  share: number;
  pmc: number;
  date: Date;
  operationType: string;
}