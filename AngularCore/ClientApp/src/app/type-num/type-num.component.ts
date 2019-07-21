import { Component, Inject, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { error, element } from 'protractor';
import { ElNotificationService } from 'element-angular'
import { ElMessageService } from 'element-angular'
import { Timeouts } from 'selenium-webdriver';
import { setTimeout } from 'timers';
import { timeout } from 'q';

@Component({
  selector: 'app-type-num',
  templateUrl: './type-num.component.html'
})
export class TypeNumComponent {

  public remain_seconds: number = 0;
  public start_count: boolean = false;
  public end_count: boolean = false;

  private test_time: number = 5;
  public row_count: number = 15;
  public line_per_minute: number = 0;
  public min: number = 0;
  public sec: number = 0;
  public generated_num_rows: Array<NumRow> = new Array<NumRow>(this.row_count);
  public generated_num_rows_color: Array<NumRowColor> = new Array<NumRowColor>(this.row_count);
  public input_rows: Array<string> = new Array<string>(this.row_count);
  public input_rows_check: Array<string> = new Array<string>(this.row_count);

  private http_client: HttpClient = null;
  private base_url: string = null;

  constructor(http: HttpClient, @Inject('BASE_URL') base_url: string,
    private notify: ElNotificationService, private message: ElMessageService, private element_ref: ElementRef) {
    this.http_client = http;
    this.base_url = base_url;
    this.RefreshNums();
  }

  public PostRecord(_uname: string, _grade: number): void {
    var record = { uname: _uname, grade: _grade };
    this.http_client.post<MyResponse>(this.base_url + 'api/TypeNum/RecvPost', record).
      subscribe(response => this.message['success']('提交成功'), error => this.message['error']('提交失败' + error));
    this.end_count = false;
  }

  //刷新随机数字
  public RefreshNums(): void {
    for (var i = 0; i < this.row_count; i++) {
      var num_row: NumRow = {
        num1: Math.ceil(Math.random() * 999),
        num2: Math.ceil(Math.random() * 999),
        num3: Number(Math.ceil(Math.random() * 99999) / 100)
      };
      var num_row_color: NumRowColor = {
        num1_color: NumCheckStatus.Unchecked,
        num2_color: NumCheckStatus.Unchecked,
        num3_color: NumCheckStatus.Unchecked
      };
      this.generated_num_rows[i] = num_row;
      this.generated_num_rows_color[i] = num_row_color;
      this.input_rows_check[i] = RowCheckStatus.Unchecked;
  //    this.input_rows_check[i] = 'check-circle';
    }
  }

  //开始测试
  public BeginTest(): void {

    this.end_count = false;
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
      this.end_count = true;
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

interface NumRowColor {
  num1_color: string;
  num2_color: string;
  num3_color: string;
}

enum NumCheckStatus {
  Unchecked = 'blue',
  Right = 'limegreen',
  Wrong = 'red'
}

enum RowCheckStatus {
  Unchecked = 'loading',
  Right = 'check',
  Wrong = 'close'
}

