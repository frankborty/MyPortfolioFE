import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { AssetOperation } from '../../../interfaces/assetOperation';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AssetOperationType } from '../../../enum/assetOperationType';
import { OperationType } from '../../../enum/operationType';
import { Asset } from '../../../interfaces/asset';

@Component({
  selector: 'app-editAssetOperation',
  imports: [ImportsModule],
  templateUrl: './editAssetOperation.component.html',
  styleUrls: ['./editAssetOperation.component.css'],
})
export class EditAssetOperationComponent implements OnInit {
  @Input() assetList: Asset[] = [];
  @Output() editAssetOperationCallBack = new EventEmitter<AssetOperation>();
  @Output() addAssetOperationCallBack = new EventEmitter<AssetOperation>();
  editAssetOperationForm: FormGroup;
  currentOperation: OperationType = OperationType.EDIT;
  currentAssetOperationId: number = -1;
  operationTypeList: AssetOperationType[]=[AssetOperationType.BUY, AssetOperationType.SELL];

  constructor() {
    this.editAssetOperationForm = new FormGroup({
      asset: new FormControl(''),
      share: new FormControl('', [Validators.required, Validators.min(0.01)]),
      pmc: new FormControl('', [Validators.required, Validators.min(0.01)]),
      date: new FormControl('', Validators.required),
      operationType: new FormControl(
        AssetOperationType.BUY,
        Validators.required
      ),
    });
  }

  ngOnInit() {}

  setAssetOperationToEdit(assetOperation: AssetOperation){
      this.currentAssetOperationId = assetOperation.assetOperationId;
      let asset = this.assetList.find(a=>a.id==assetOperation.assetId);
      this.editAssetOperationForm.patchValue({
        asset: asset,
        share: assetOperation.share,
        pmc: assetOperation.pmc,
        date: assetOperation.date,
        operationType: assetOperation.operationType
      });
    }

  setCurrentOperation(opType: OperationType) {
    this.currentOperation = opType;
  }

  onUserSave() {
      if(this.editAssetOperationForm.invalid){
        console.log('Form is invalid');
        return;
      }
      const formValue = this.editAssetOperationForm.value;
      const workItem : AssetOperation= {
        assetOperationId: this.currentAssetOperationId,
        assetId : formValue.asset.id,
        operationType : formValue.operationType,
        date: formValue.date,
        pmc: formValue.pmc,
        share: formValue.share,
      };
      this.editAssetOperationForm.reset();
      if(this.currentOperation==OperationType.EDIT){
      this.editAssetOperationCallBack.emit(workItem);   
      }
      else{
        this.addAssetOperationCallBack.emit(workItem)
      } 
    }
}
