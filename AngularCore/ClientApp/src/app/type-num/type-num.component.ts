import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { error } from 'protractor';
import { ElNotificationService } from 'element-angular'
import { Timeouts } from 'selenium-webdriver';
import { setTimeout } from 'timers';
import { timeout } from 'q';

@Component({
  selector: 'app-type-num',
  templateUrl: './type-num.component.html'
})
export class TypeNumComponent {

  public generated_num_rows: Array<NumRow> = new Array<NumRow>();
  public remain_seconds: number = 0;
  public start_count: boolean = false;

  private test_time: number = 180;
  public line_per_minute: number = 0;
  public min: number = 0;
  public sec: number = 0;

  private http_client: HttpClient = null;
  private base_url: string = null;

  constructor(http: HttpClient, @Inject('BASE_URL') base_url: string,
    private notify: ElNotificationService) {
    this.http_client = http;
    this.base_url = base_url;
    this.GenerateNums();
  }

  public PostRecord(): void {
    var record = { uname: '123', grade: 456 };
    this.http_client.post<MyResponse>(this.base_url + 'api/TypeNum/RecvPost', record).
      subscribe(response => alert(response.msg), error => console.log(error));
  }

  //生成输入的随机数字
  public GenerateNums(): void {
    for (var i = 0; i < 15; i++) {
      var num_row: NumRow = {
        num1: Math.ceil(Math.random() * 999),
        num2: Math.ceil(Math.random() * 999),
        num3: Number(Math.ceil(Math.random() * 99999) / 100)
      };
      this.generated_num_rows.push(num_row);
    }
  }

  //刷新随机数字
  public RefreshNums(): void {
    for (var i = 0; i < 15; i++) {
      var num_row: NumRow = {
        num1: Math.ceil(Math.random() * 999),
        num2: Math.ceil(Math.random() * 999),
        num3: Number(Math.ceil(Math.random() * 99999) / 100)
      };
      this.generated_num_rows[i] = num_row;
    }
  }

  //开始测试
  public BeginTest(): void {
    if (this.start_count) return;
    this.notify.setOptions({ duration: 2000 })
    this.notify['success']('计时3分钟，每页15行', '开始测试')
    this.start_count = true;
    this.remain_seconds = this.test_time + 1;
    this.CountDown();
  }

  //更新倒计时
  public CountDown(): void {
    this.remain_seconds--;
    this.min = Math.floor(this.remain_seconds / 60);
    this.sec = this.remain_seconds % 60;
    if (this.remain_seconds > 0) {
      setTimeout(() => {
        this.CountDown()
      }, 1000);
    }
    else {
      this.start_count = false;
    }
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
