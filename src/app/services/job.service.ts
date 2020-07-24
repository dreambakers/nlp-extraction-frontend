import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { constants } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constants = constants;

  constructor(private http: HttpClient) { }

  invokeJob(properties) {
    return this.http.post(`${constants.apiUrl}/job/invoke`, { properties });
  }

  getAllJobs() {
    return this.http.get(`${constants.apiUrl}/job/all`);
  }

  download(fileName){
    return this.http.post(`${constants.apiUrl}/job/download`, { fileName }, {
      responseType : 'blob',
    });
  }
}