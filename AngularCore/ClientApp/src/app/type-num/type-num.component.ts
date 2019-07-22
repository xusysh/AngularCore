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
  public uname: string = '';

  private test_time: number = 5;
  public row_count: number = 15;
  public row_per_minute: number = 0;
  public right_row_count: number = 0;
  public min: number = 0;
  public sec: number = 0;

  public generated_num_rows: Array<NumRow> = new Array<NumRow>(this.row_count);
  public generated_num_rows_color: Array<NumRowColor> = new Array<NumRowColor>(this.row_count);
  public input_rows: Array<string> = new Array<string>(this.row_count);
  public input_rows_check: Array<string> = new Array<string>(this.row_count);
  public current_focus: number = 0;
  public focus: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  private http_client: HttpClient = null;
  private base_url: string = null;

  constructor(http: HttpClient, @Inject('BASE_URL') base_url: string,
    private notify: ElNotificationService, private message: ElMessageService, private element_ref: ElementRef) {
    this.http_client = http;
    this.base_url = base_url;
    this.RefreshNums();
  }

  //提交记录
  public PostRecord(): void {
    var record = { id: 0, uname: this.uname === '' ? '匿名' : this.uname, grade: this.row_per_minute };
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
      this.input_rows[i] = '';
      this.input_rows_check[i] = RowCheckStatus.Unchecked;
    }
  }

  //开始测试
  public BeginTest(): void {
    this.end_count = false;
    if (this.start_count) return;
    this.notify.setOptions({ duration: 3000 })
    this.notify['success']('计时3分钟，每页15行，按回车换行', '开始测试')
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
    else {      //时间到，测试结束
      this.start_count = false;
      this.end_count = true;
      this.RefreshNums();
    }
  }

  //input框触发按键事件的回调函数
  public OnKeyPress(event: any) {
    if (!this.start_count)
      this.BeginTest();
    var keycode = window.event ? event.keyCode : event.which;   //获取按键编码
    if (keycode == 13) {    //回车
      alert(this.current_focus);
    }
    else if ((keycode >= 0x30 && keycode <= 0x39) || keycode == 46) {   //小键盘数字
      if (this.input_rows[0].length == 3 || this.input_rows[0].length == 8)
        this.input_rows[0] += ", ";
    }
    else return false;
  }

  public OnKeyDown(event: any) {
    var keycode = window.event ? event.keyCode : event.which;   //获取按键编码
    if (keycode == 8) {         //退格
      if (this.input_rows[0].length == 5 || this.input_rows[0].length == 10)
        this.input_rows[0] = this.input_rows[0].substring(0, this.input_rows[0].length - 2);
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

