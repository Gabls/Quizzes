import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServidorService {

  constructor(private http: HttpClient) { }

  post(url: string, data: any){
    let jason = JSON.stringify(data);
    let body = data;

    return this.http.post(url, body);
  }
}
