import { Component, Input } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-param-confirmation-dialog',
  imports: [ImportsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './param-confirmation-dialog.component.html',
  styleUrl: './param-confirmation-dialog.component.css'
})
export class ParamConfirmationDialogComponent {
  public messageToShow : string = "";
  constructor(private confirmationService: ConfirmationService, 
    private messageService: MessageService) { }

    confirmDelete(messageToShow:string): Promise<boolean> {
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
          }
        });
      });
    }
}
