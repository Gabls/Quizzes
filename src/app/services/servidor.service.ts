import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServidorService {

  constructor(private http: HttpClient) { }

  get(url: string, token: string){
    if(token != ""){
      let header = new HttpHeaders().append("x-api-key", token);
      return this.http.get(url, {headers : header});
    }

    return this.http.get(url);
  }

  post(url: string, data: object, token: string){
    if(token != ""){
      let header = new HttpHeaders().append("x-api-key", token);
      return this.http.post(url, data, {headers : header});
    }

    return this.http.post(url, data);
  }
}