import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { error } from 'protractor';

@Component({
  selector: 'app-type-num',
  templateUrl: './type-num.component.html'
})
export class TypeNumComponent {

  public currentCount: number = 0;
  private httpClient: HttpClient = null;
  private baseUrl: string = null;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.httpClient = http;
    this.baseUrl = baseUrl;
  }

  public PostRecord() {
    var record = { uname: '123', grade: 456 };
    this.httpClient.post<MyResponse>(this.baseUrl + 'api/TypeNum/RecvPost', record).
      subscribe(response => alert(response.msg), error => console.log(error));
  }

  public CountDown() {
    
  }


}

interface MyResponse {
  msg: string;
}
