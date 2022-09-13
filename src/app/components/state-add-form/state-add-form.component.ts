//***** Template Driven Form ******* */

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Country } from 'src/app/shared/models/country';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-state-add-form',
  templateUrl: './state-add-form.component.html',
  styleUrls: ['./state-add-form.component.css'],
})
export class StateAddFormComponent implements OnInit {
  statusMessage: string = '';
  isSavedSuccess: boolean = false;
  isSubmitted: boolean = false;
  isErrorAlertDisplay: boolean = false;
  selectDefault: number = null;
  countryList: Country[] = [];

  constructor(private _dataService: DataService, private _router: Router) {}

  ngOnInit(): void {
    this.getCountryList();
  }

  getCountryList() {
    let params = new HttpParams();
    this._dataService.getData('Country/List', params).subscribe((res) => {
      debugger;
      if (res) {
        console.log(res);

        // let country: Country = new Country();
        // country.countryId = null;
        // country.countryName = '-- Select --';

        //this.countryList.push(country);

        res.forEach((ele) => {
          console.log(ele);
          this.countryList.push(ele);
        });
      }
    });
  }

  onSubmit(form: NgForm) {
    this.isSubmitted = true;
    console.log(form);

    const body = {
      stateName: form.value.stateName,
      countryId: form.value.countryId,
    };

    this._dataService.postData('State/Create', body, null).subscribe({
      next: (res) => {
        debugger;
        console.log('Result: ', res);
        if (res.stateId) {
          this.statusMessage = `New State Name is saved successfully with State Id: ${res.stateId}`;
          this.isSavedSuccess = true;

          form.resetForm();
        } else {
          this.statusMessage = res.title;
          this.isSavedSuccess = false;
          this.isErrorAlertDisplay = true;
        }
      },
      error: (err) => {
        debugger;

        this.statusMessage = `There was some error while save data. Error: ${err.error.title}`;
        this.isSavedSuccess = false;
      },
    });
  }

  redirectToList() {
    this._router.navigate(['/state-list']);
  }
}
