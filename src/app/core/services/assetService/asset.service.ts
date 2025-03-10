import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Asset } from '../../interfaces/asset';
import { AssetCategory } from '../../interfaces/assetCategory';
import { AssetValueSummary } from '../../interfaces/assetValueSummary';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private apiUrl = environment.backendUrl;
  private options = { headers: { 'Content-Type': 'application/json' } };
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  //#region  GET DATA
  getAssetsSummaryByMonth(): Observable<AssetValueSummary[]> {
    return this.http
      .get<AssetValueSummary[]>(`${this.apiUrl}/AssetValue/SummaryByMonth`, this.options)
      .pipe(
        map(data =>
          data.map(summary => ({
            ...summary,
            assetValueList: summary.assetValueList.map(value => ({
              ...value,
              timeStamp: new Date(value.timeStamp) // Converte la stringa in Date
            }))
          }))
        ),
        catchError(this.errorHandler.handleError)
      );
  }

  getAssetList(): Observable<Asset[]> {
    return this.http
      .get<Asset[]>(`${this.apiUrl}/Asset`, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getAssetWithValueList(): Observable<Asset[]> {
    return this.http
      .get<Asset[]>(`${this.apiUrl}/Asset/withValue`, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getAssetCategoryList() {
    return this.http
      .get<AssetValueSummary[]>(`${this.apiUrl}/AssetCategory`, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion

  //#region ADD DATA
  addAsset(asset: Asset) {
    return this.http
      .post(`${this.apiUrl}/Asset`, asset, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  addAssetCategory(assetCategory: AssetCategory) {
    return this.http
      .post(`${this.apiUrl}/AssetCategory`, assetCategory, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion

  //#region  DELETE DATA
  deleteAsset(assetId: number) {
    const url = `${this.apiUrl}/Asset?assetId=${encodeURIComponent(assetId)}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.errorHandler.handleError));
  }

  deleteAssetCategory(assetCategoryId: number) {
    const url = `${
      this.apiUrl
    }/AssetCategory?assetCategoryId=${encodeURIComponent(assetCategoryId)}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion

  //#regione UPDATE DATA
  updateAssetValueSummary(newAssetValueSummary: AssetValueSummary) {
    return this.http
      .put<AssetValueSummary>(
        `${this.apiUrl}/AssetValue/SummaryByMonth`,
        newAssetValueSummary,
        this.options
      )
      .pipe(catchError(this.errorHandler.handleError));
  }

  editAsset(assetId: number, newAsset: Asset) {
    return this.http
      .put(`${this.apiUrl}/Asset/${assetId}`, newAsset, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }

  editAssetCategory(assetCategoryId: number, newAssetCategory: AssetCategory) {
    return this.http
      .put(
        `${this.apiUrl}/AssetCategory/${assetCategoryId}`,
        newAssetCategory,
        this.options
      )
      .pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion
}
