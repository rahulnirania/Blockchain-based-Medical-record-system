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
import { PatientService } from './Patient.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-patient',
  templateUrl: './Patient.component.html',
  styleUrls: ['./Patient.component.css'],
  providers: [PatientService]
})
export class PatientComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  patientId = new FormControl('', Validators.required);
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  medRec = new FormControl('', Validators.required);
  insurance = new FormControl('', Validators.required);
  authorisedDoctor = new FormControl('', Validators.required);
  authorisedInsurer = new FormControl('', Validators.required);


  constructor(public servicePatient: PatientService, fb: FormBuilder) {
    this.myForm = fb.group({
      patientId: this.patientId,
      firstName: this.firstName,
      lastName: this.lastName,
      medRec: this.medRec,
      insurance: this.insurance,
      authorisedDoctor: this.authorisedDoctor,
      authorisedInsurer: this.authorisedInsurer
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicePatient.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.ehr.hackathon.Patient',
      'patientId': this.patientId.value,
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'medRec': this.medRec.value,
      'insurance': this.insurance.value,
      'authorisedDoctor': this.authorisedDoctor.value,
      'authorisedInsurer': this.authorisedInsurer.value
    };

    this.myForm.setValue({
      'patientId': null,
      'firstName': null,
      'lastName': null,
      'medRec': null,
      'insurance': null,
      'authorisedDoctor': null,
      'authorisedInsurer': null
    });

    return this.servicePatient.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'patientId': null,
        'firstName': null,
        'lastName': null,
        'medRec': null,
        'insurance': null,
        'authorisedDoctor': null,
        'authorisedInsurer': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.ehr.hackathon.Patient',
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'medRec': this.medRec.value,
      'insurance': this.insurance.value,
      'authorisedDoctor': this.authorisedDoctor.value,
      'authorisedInsurer': this.authorisedInsurer.value
    };

    return this.servicePatient.updateParticipant(form.get('patientId').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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


  deleteParticipant(): Promise<any> {

    return this.servicePatient.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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

    return this.servicePatient.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'patientId': null,
        'firstName': null,
        'lastName': null,
        'medRec': null,
        'insurance': null,
        'authorisedDoctor': null,
        'authorisedInsurer': null
      };

      if (result.patientId) {
        formObject.patientId = result.patientId;
      } else {
        formObject.patientId = null;
      }

      if (result.firstName) {
        formObject.firstName = result.firstName;
      } else {
        formObject.firstName = null;
      }

      if (result.lastName) {
        formObject.lastName = result.lastName;
      } else {
        formObject.lastName = null;
      }

      if (result.medRec) {
        formObject.medRec = result.medRec;
      } else {
        formObject.medRec = null;
      }

      if (result.insurance) {
        formObject.insurance = result.insurance;
      } else {
        formObject.insurance = null;
      }

      if (result.authorisedDoctor) {
        formObject.authorisedDoctor = result.authorisedDoctor;
      } else {
        formObject.authorisedDoctor = null;
      }

      if (result.authorisedInsurer) {
        formObject.authorisedInsurer = result.authorisedInsurer;
      } else {
        formObject.authorisedInsurer = null;
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
      'patientId': null,
      'firstName': null,
      'lastName': null,
      'medRec': null,
      'insurance': null,
      'authorisedDoctor': null,
      'authorisedInsurer': null
    });
  }
}
