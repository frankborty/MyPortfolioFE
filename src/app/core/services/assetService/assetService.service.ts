import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';
import { AssetValueSummary } from '../../interfaces/assetValueSummary';

@Injectable({
  providedIn: 'root'
})
export class AssetServiceService {
  private apiUrl = environment.backendUrl;
  private options = { headers: { 'Content-Type': 'application/json' } };
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  //#region  GET DATA
  getAssetsSummaryByMonth() {
    return this.http
      .get<AssetValueSummary[]>(`${this.apiUrl}/AssetValue/SummaryByMonth`, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion

  //#region  UPDATE DATA
  updateAssetValueSummary(assetValueSummary: AssetValueSummary) {
    return this.http
      .put<AssetValueSummary>(`${this.apiUrl}/AssetValue/SummaryByMonth`, assetValueSummary, this.options)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //#endregion

}
