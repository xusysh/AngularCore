import { Component, Inject, ElementRef, ViewChildren, ViewChild, QueryList, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElNotificationService } from 'element-angular'
import { ElMessageService } from 'element-angular'
import { setTimeout } from 'timers';

@Component({
  selector: 'app-type-ch',
  templateUrl: './type-ch.component.html'
})
export class TypeChComponent {
  //控制测试界面元素
  public row_count: number = 15;
  public test_time: number = 180;
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

  public RefreshCHs(): void {

  }
}

interface MyResponse {
  msg: string;
}
