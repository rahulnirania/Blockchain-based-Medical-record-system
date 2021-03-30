/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CreateInsuranceService } from './CreateInsurance.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-createinsurance',
  templateUrl: './CreateInsurance.component.html',
  styleUrls: ['./CreateInsurance.component.css'],
  providers: [CreateInsuranceService]
})
export class CreateInsuranceComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;

  patient = new FormControl('', Validators.required);
  insurer = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  Description = new FormControl('', Validators.required);
  Amount = new FormControl('', Validators.required);
  Handler = new FormControl('', Validators.required);
  ExpireOn = new FormControl('', Validators.required);
  files = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceCreateInsurance: CreateInsuranceService, fb: FormBuilder) {
    this.myForm = fb.group({
      patient: this.patient,
      insurer: this.insurer,
      type: this.type,
      Description: this.Description,
      Amount: this.Amount,
      Handler: this.Handler,
      ExpireOn: this.ExpireOn,
      files: this.files,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCreateInsurance.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      this.allTransactions = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the transaction field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ehr.hackathon.CreateInsurance',
      'patient': this.patient.value,
      'insurer': this.insurer.value,
      'type': this.type.value,
      'Description': this.Description.value,
      'Amount': this.Amount.value,
      'Handler': this.Handler.value,
      'ExpireOn': this.ExpireOn.value,
      'files': this.files.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'patient': null,
      'insurer': null,
      'type': null,
      'Description': null,
      'Amount': null,
      'Handler': null,
      'ExpireOn': null,
      'files': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceCreateInsurance.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'patient': null,
        'insurer': null,
        'type': null,
        'Description': null,
        'Amount': null,
        'Handler': null,
        'ExpireOn': null,
        'files': null,
        'transactionId': null,
        'timestamp': null
      });
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

  updateTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ehr.hackathon.CreateInsurance',
      'patient': this.patient.value,
      'insurer': this.insurer.value,
      'type': this.type.value,
      'Description': this.Description.value,
      'Amount': this.Amount.value,
      'Handler': this.Handler.value,
      'ExpireOn': this.ExpireOn.value,
      'files': this.files.value,
      'timestamp': this.timestamp.value
    };

    return this.serviceCreateInsurance.updateTransaction(form.get('transactionId').value, this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
      this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  deleteTransaction(): Promise<any> {

    return this.serviceCreateInsurance.deleteTransaction(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceCreateInsurance.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'patient': null,
        'insurer': null,
        'type': null,
        'Description': null,
        'Amount': null,
        'Handler': null,
        'ExpireOn': null,
        'files': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.patient) {
        formObject.patient = result.patient;
      } else {
        formObject.patient = null;
      }

      if (result.insurer) {
        formObject.insurer = result.insurer;
      } else {
        formObject.insurer = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.Description) {
        formObject.Description = result.Description;
      } else {
        formObject.Description = null;
      }

      if (result.Amount) {
        formObject.Amount = result.Amount;
      } else {
        formObject.Amount = null;
      }

      if (result.Handler) {
        formObject.Handler = result.Handler;
      } else {
        formObject.Handler = null;
      }

      if (result.ExpireOn) {
        formObject.ExpireOn = result.ExpireOn;
      } else {
        formObject.ExpireOn = null;
      }

      if (result.files) {
        formObject.files = result.files;
      } else {
        formObject.files = null;
      }

      if (result.transactionId) {
        formObject.transactionId = result.transactionId;
      } else {
        formObject.transactionId = null;
      }

      if (result.timestamp) {
        formObject.timestamp = result.timestamp;
      } else {
        formObject.timestamp = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
      this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'patient': null,
      'insurer': null,
      'type': null,
      'Description': null,
      'Amount': null,
      'Handler': null,
      'ExpireOn': null,
      'files': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
