import { Component, Inject, ElementRef, ViewChildren, ViewChild, QueryList, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElNotificationService } from 'element-angular'
import { ElMessageService } from 'element-angular'
import { RandomChar } from '../tools/random-ch';

@Component({
  selector: 'app-type-ch',
  templateUrl: './type-ch.component.html'
})
export class TypeChComponent {
  //控制测试界面元素
  public ch_per_row: number = 15;
  public row_count: number = 5;
  public test_time: number = 30;
  public remain_seconds: number = 0;
  public min: number = 0;
  public sec: number = 0;
  //测试数据&业务逻辑
  public uname: string = '';
  public ch_per_minute: number = 0;
  public right_ch_count: number = 0;
  public right_ch_count_prev: number = 0;
  public start_count: boolean = false;
  public end_count: boolean = false;
  //控制界面元素显示
  public input_rows: Array<string> = new Array<string>(this.row_count);
  public generated_ch_rows: Array<Array<string>> = new Array<Array<string>>(this.row_count);
  public generated_ch_rows_color: Array<Array<string>> = new Array<Array<string>>(this.row_count);
  public current_focus_row: number = 0;
  public random_ch: RandomChar = new RandomChar();
  //提交http请求
  private http_client: HttpClient = null;
  private base_url: string = null;

  private inputs: any = document.getElementsByClassName('el-input__inner');
  ngAfterViewInit() {
    this.inputs[this.current_focus_row].focus();
  }

  constructor(http: HttpClient, @Inject('BASE_URL') base_url: string,
    private notify: ElNotificationService, private message: ElMessageService) {
    this.http_client = http;
    this.base_url = base_url;
    this.RefreshCHs(true);
  }

  //提交记录
  public PostRecord(): void {
    var record = {
      id: 0, uname: this.uname === '' ? '匿名' : this.uname,
      grade: Math.round(this.ch_per_minute)
    };
    this.http_client.post<MyResponse>(this.base_url + 'api/TypeCh/RecvPost', record).
      subscribe(response => this.message['success']('提交成功'), error => this.message['error']('提交失败' + error));
    this.end_count = false;
  }

  //刷新汉字
  public RefreshCHs(reset: boolean = false): void {
    if (reset) this.right_ch_count_prev = 0;
    else this.right_ch_count_prev = this.right_ch_count;
    for (let i = 0; i < this.row_count; i++) {
      this.input_rows[i] = '';
      this.generated_ch_rows[i] = new Array<string>(this.ch_per_row);
      this.generated_ch_rows_color[i] = new Array<string>(this.ch_per_row);
      for (let j = 0; j < this.ch_per_row; j++) {
        this.generated_ch_rows[i][j] = this.random_ch.simplified();
        this.generated_ch_rows_color[i][j] = ChCheckStatus.Unchecked;
      }
    }
  }

  //开始测试
  public BeginTest(): void {
    this.end_count = false;
    this.right_ch_count = 0;
    this.ch_per_minute = 0;
    if (this.start_count) return;
    this.notify.setOptions({ duration: 3000 })
    this.notify['success']('计时3分钟，每页5行，每行15字，按回车换行', '开始测试')
    this.start_count = true;
    this.remain_seconds = this.test_time + 1;
    this.CountDown();
  }

  //更新倒计时
  public CountDown(): void {
    this.remain_seconds--;
    this.min = Math.floor(this.remain_seconds / 60);
    this.sec = this.remain_seconds % 60;
    this.ch_per_minute = this.right_ch_count / (this.test_time - this.remain_seconds) * 60;
    if (this.remain_seconds > 0) {
      setTimeout(() => {
        this.CountDown()
      }, 1000);
    }
    else {      //时间到，测试结束
      this.start_count = false;
      this.end_count = true;
      this.ch_per_minute = this.right_ch_count / (this.test_time - this.remain_seconds) * 60;
      this.RefreshCHs();
    }
  }

  //input框触发按键事件的回调函数
  public OnKeyPress(event: any) {
    if (!this.start_count)
      this.BeginTest();
    var keycode = window.event ? event.keyCode : event.which;   //获取按键编码
    if (keycode == 13) {    //回车
      this.NextInput();
    }
  }

  public OnKeyDown(event: any) {
    if (!this.start_count)
      this.BeginTest();
    var keycode = window.event ? event.keyCode : event.which;   //获取按键编码
    if (keycode == 8) {         //退格
      if (this.input_rows[this.current_focus_row].length == 1
        || this.input_rows[this.current_focus_row].length == 0) {
        this.generated_ch_rows_color[this.current_focus_row][0] = ChCheckStatus.Unchecked;
        this.input_rows[this.current_focus_row] = '';
        this.PrevInput();
        return false;
      }
    }
    this.CountRightCh();
  }

  public InputRowChanged() {
    var cur_row = this.input_rows[this.current_focus_row];
    for (let i = 0; i < cur_row.length; i++) {
      if (cur_row[i] == this.generated_ch_rows[this.current_focus_row][i]) 
        this.generated_ch_rows_color[this.current_focus_row][i] = ChCheckStatus.Right;
      else
        this.generated_ch_rows_color[this.current_focus_row][i] = ChCheckStatus.Wrong;
    }
    for (let i = cur_row.length; i < this.ch_per_row; i++) {
      this.generated_ch_rows_color[this.current_focus_row][i] = ChCheckStatus.Unchecked;
    }
    if (this.input_rows[this.current_focus_row].length >= this.ch_per_row)
      this.NextInput();
    this.CountRightCh();
  }

  public NextInput() {
    this.inputs[this.current_focus_row].blur();
    if (this.current_focus_row == this.row_count - 1) {
      this.RefreshCHs();
      this.current_focus_row = 0;
    }
    else {
      this.current_focus_row++;
    }
    setTimeout(() => { this.inputs[this.current_focus_row].focus(); }, 50);
  }

  public PrevInput() {
    this.inputs[this.current_focus_row].blur();
    if (this.current_focus_row != 0) {
      this.current_focus_row--;
    }
    setTimeout(() => { this.inputs[this.current_focus_row].focus(); }, 50);
  }

  public CountRightCh() {
    this.right_ch_count = this.right_ch_count_prev;
    for (let i = 0; i < this.row_count; i++) {
      for (let j = 0; j < this.ch_per_row; j++) {
        if (this.generated_ch_rows_color[i][j] == ChCheckStatus.Right) {
          this.right_ch_count++;
        }
      }
    }
  }

}

interface MyResponse {
  msg: string;
}

enum ChCheckStatus {
  Unchecked = 'black',
  Right = 'limegreen',
  Wrong = 'red'
}
