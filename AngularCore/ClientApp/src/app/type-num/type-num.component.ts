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
  public generated_num_rows: Array<NumRow> = new Array<NumRow>();

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.httpClient = http;
    this.baseUrl = baseUrl;
    this.GenerateNums();
  }

  public PostRecord() {
    var record = { uname: '123', grade: 456 };
    this.httpClient.post<MyResponse>(this.baseUrl + 'api/TypeNum/RecvPost', record).
      subscribe(response => alert(response.msg), error => console.log(error));
  }

  //生成输入的随机数字
  public GenerateNums() {
    for (var i = 0; i < 20; i++) {
      var num_row: NumRow = {
        num1: Math.ceil(Math.random() * 999),
        num2: Math.ceil(Math.random() * 999),
        num3: Math.ceil(Math.random() * 999)
      };
      this.generated_num_rows.push(num_row);
    }
  }

  //更新倒计时
  public CountDown() {

  }

}

interface MyResponse {
  msg: string;
}

interface NumRow {
  num1: number;
  num2: number;
  num3: number;
}
