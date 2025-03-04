import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports';

@Component({
  selector: 'app-paramConfirmationDialog',
  imports: [ImportsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './paramConfirmationDialog.component.html',
  styleUrls: ['./paramConfirmationDialog.component.css'],
})
export class ParamConfirmationDialogComponent {
  public messageToShow: string = '';
  constructor(private confirmationService: ConfirmationService) {}

  confirmDelete(messageToShow: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        message: messageToShow,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Accept',
          severity: 'danger',
        },
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        },
      });
    });
  }
}
