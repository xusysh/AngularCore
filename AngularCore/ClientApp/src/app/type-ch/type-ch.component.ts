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
  public row_count: number = 15;
  public test_time: number = 180;
  public remain_seconds: number = 0;
  public min: number = 0;
  public sec: number = 0;
  //测试数据&业务逻辑
  public uname: string = '';
  public ch_per_minute: number = 0;
  public right_ch_count: number = 0;
  public start_count: boolean = false;
  public end_count: boolean = false;
  //控制界面元素显示
  public input_rows: Array<string> = new Array<string>(this.row_count);
  public current_focus_row: number = 0;
  public random_ch: RandomChar = new RandomChar();
  //提交http请求
  private http_client: HttpClient = null;
  private base_url: string = null;

  constructor(http: HttpClient, @Inject('BASE_URL') base_url: string,
    private notify: ElNotificationService, private message: ElMessageService) {
    this.http_client = http;
    this.base_url = base_url;
    this.RefreshCHs();
  }

  //提交记录
  public PostRecord(): void {
    var record = {
      id: 0, uname: this.uname === '' ? '匿名' : this.uname,
      grade: Math.round(this.ch_per_minute)
    };
    this.http_client.post<MyResponse>(this.base_url + 'api/TypeNum/RecvPost', record).
      subscribe(response => this.message['success']('提交成功'), error => this.message['error']('提交失败' + error));
    this.end_count = false;
  }

  //刷新汉字
  public RefreshCHs(): void {
    alert(this.random_ch.simplified());
  }

  //开始测试
  public BeginTest(): void {
    this.end_count = false;
    this.right_ch_count = 0;
    this.ch_per_minute = 0;
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
}

interface MyResponse {
  msg: string;
}
