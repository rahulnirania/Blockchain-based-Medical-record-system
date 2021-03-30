import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.ehr.hackathon{
   export class Patient extends Participant {
      patientId: string;
      firstName: string;
      lastName: string;
      medRec: MedicalRecord[];
      insurance: Insurance[];
      authorisedDoctor: string[];
      authorisedInsurer: string[];
   }
   export class Doctor extends Participant {
      doctorId: string;
      firstName: string;
      lastName: string;
   }
   export class Insurer extends Participant {
      insId: string;
      Name: string;
      address: string;
      Number: string;
   }
   export class MedicalRecord {
      recordId: string;
      doctor: Doctor;
      diagnosis: string;
      medicine: string[];
      quantity: number[];
      files: string[];
   }
   export class Insurance {
      recordId: string;
      insurer: Insurer;
      type: string;
      Description: string;
      Amount: number;
      Handler: string;
      ExpireOn: Date;
      files: string[];
   }
   export class CreateMedicalRecord extends Transaction {
      patient: Patient;
      doctor: Doctor;
      diagnosis: string;
      medicine: string[];
      quantity: number[];
      files: string[];
   }
   export class CreateInsurance extends Transaction {
      patient: Patient;
      insurer: Insurer;
      type: string;
      Description: string;
      Amount: number;
      Handler: string;
      ExpireOn: Date;
      files: string[];
   }
// }
