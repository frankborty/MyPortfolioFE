import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, interval, of, switchMap } from 'rxjs';
import { AssetCategory } from '../../interfaces/assetCategory';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';
import { GlobalUtilityService } from './global-utility.service';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private apiUrl = environment.backendUrl;
  private options = { headers: { 'Content-Type': 'application/json' } };
  public backEndStatusError = signal(false);
  public backEndStatusErrorMsg = signal("");

  constructor(
    private http: HttpClient,
    private globalUtils : GlobalUtilityService,
  ) {
    this.startPollingBeStatus();
  }


  private startPollingBeStatus() {
    interval(15000) // Esegue ogni 15 secondi
      .pipe(
        switchMap(() =>
          this.http
            .get<AssetCategory[]>(`${this.apiUrl}/AssetCategory`, this.options)
            .pipe(
              catchError((error) => {
                // Gestione errore, restituisci un valore "safe" per mantenere il flusso attivo
                this.backEndStatusError.set(true);
                this.backEndStatusErrorMsg.set(this.globalUtils.getErrorMsg(error));
                return of(null); // Restituisci un valore nullo per identificare l'errore
              })
            )
        )
      )
      .subscribe((data) => {
        if (data) {
          this.backEndStatusError.set(false);
          this.backEndStatusErrorMsg.set("");
        }
      });
  }
}
