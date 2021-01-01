import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {observable} from 'mobx';
import {Observable} from 'rxjs';

@Injectable({
              providedIn: 'root'
            })

export class BaseAjaxAdapter {
  BASE_URL = 'http://localhost:5000';

  constructor(public http: HttpClient) {
  }
  requestAll(path: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${path}`);
  }

  @observable
  async request<T>(path: string): Promise<T> {
    return this.http
               .get<T>(`${this.BASE_URL}/${path}`)
               .toPromise<T>();
  }

  async post(path: string, body: any): Promise<any> {
    return this.http
               .post(`${this.BASE_URL}/${path}`, body)
               .toPromise();
  }

  async postLogin(path: string, body: any): Promise<any> {
    return this.http
               .post(`${this.BASE_URL}/${path}`, body)
               .toPromise();
  }

  async delete(path: string): Promise<any> {
    return this.http
               .delete(`${this.BASE_URL}/${path}`)
               .toPromise();
  }

}
