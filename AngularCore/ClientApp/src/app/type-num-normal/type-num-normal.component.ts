import { Component, Inject, ElementRef, ViewChildren, ViewChild, QueryList, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElNotificationService } from 'element-angular'
import { ElMessageService } from 'element-angular'
import { parse } from 'path';

@Component({
  selector: 'app-type-num-normal',
  templateUrl: './type-num-normal.component.html'
})
export class TypeNumNormalComponent {
  //控制测试界面元素
  public row_count: number = 15;
  public test_time: number = 180;
  public min: number = 0;
  public sec: number = 0;
  //测试数据&业务逻辑
  public uname: string = '';
  public row_per_minute: number = 0;
  public right_row_count: number = 0;
  public all_row_count: number = 0;
  public accuracy_percent: number = 0;
  public remain_seconds: number = 0;
  public start_count: boolean = false;
  public end_count: boolean = false;
  //控制界面元素显示
  public generated_num_rows: Array<number> = new Array<number>(this.row_count);
  public generated_num_rows_color: Array<string> = new Array<string>(this.row_count);
  public input_rows: Array<string> = new Array<string>(this.row_count);
  public input_rows_check: Array<string> = new Array<string>(this.row_count);
  public current_focus_row: number = 0;
  //提交http请求
  private http_client: HttpClient = null;
  private base_url: string = null;

  //element angular里的组件与原生的不同，所以放弃标准的angular方法
  //定义为any防止类型检查报错，实际类型为HtmlCollectionOf<Element>
  private inputs: any = document.getElementsByClassName('el-input__inner');
  /* 
  private input_elems: Array<any>;   
  @ViewChildren('inputs') input_doms: QueryList<ElementRef>;
  */
  //页面元素渲染成功后调用
  ngAfterViewInit() {
    /*   this.input_elems = this.input_doms.toArray();
       for (var prop in this.input_elems[0]) {
         alert(prop + '\n' + this.input_doms[prop]);
       } */
    this.inputs[this.current_focus_row].focus();
  }

  //构造函数（页面元素渲染成功前）
  constructor(http: HttpClient, @Inject('BASE_URL') base_url: string,
    private notify: ElNotificationService, private message: ElMessageService) {
    this.http_client = http;
    this.base_url = base_url;
    this.RefreshNums();
    this.Entered();
  }

  public Entered() {
    var msg: MyStrPost = {
      msg: 'entered'
    };
    this.http_client.post<MyResponse>(this.base_url + 'api/TypeNum/RecvEnteredMsg', msg).
      subscribe(response => console.log(response), error => console.log(error));
    this.end_count = false;
  }

  //提交记录
  public PostRecord(): void {
    var record = {
      id: 0,
      uname: this.uname === '' ? '匿名' : this.uname,
      grade: Math.round(this.row_per_minute)
    };
    this.http_client.post<MyResponse>(this.base_url + 'api/TypeNum/RecvPost', record).
      subscribe(response => this.message['success']('提交成功'), error => this.message['error']('提交失败' + error));
    this.end_count = false;
  }

  //刷新随机数字
  public RefreshNums(): void {
    for (var i = 0; i < this.row_count; i++) {
      let num_row = Number(Math.ceil(Math.random() * 100000000) / 100);
      this.generated_num_rows[i] = num_row;
      this.generated_num_rows_color[i] = NumCheckStatus.Unchecked;
      this.input_rows[i] = '';
      this.input_rows_check[i] = RowCheckStatus.Unchecked;
    }
  }

  //开始测试
  public BeginTest(): void {
    this.end_count = false;
    this.right_row_count = 0;
    this.all_row_count = 0;
    this.row_per_minute = 0;
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
    this.row_per_minute = this.right_row_count / (this.test_time - this.remain_seconds) * 60;
    this.accuracy_percent = this.right_row_count / this.all_row_count * 100;
    if (this.remain_seconds > 0) {
      setTimeout(() => {
        this.CountDown()
      }, 1000);
    }
    else {      //时间到，测试结束
      this.start_count = false;
      this.end_count = true;
      this.row_per_minute = this.right_row_count / (this.test_time - this.remain_seconds) * 60;
      this.accuracy_percent = this.right_row_count / this.all_row_count * 100;
      this.RefreshNums();
    }
  }

  //input框触发按键事件的回调函数
  public OnKeyPress(event: any) {
    var cur = this.current_focus_row;
    if (!this.start_count)
      this.BeginTest();
    var keycode = window.event ? event.keyCode : event.which;   //获取按键编码
    if (keycode == 13) {    //回车
      this.Judge(cur);
      this.NextInput();
    }
    else if ((keycode >= 0x30 && keycode <= 0x39) || keycode == 46) {   //小键盘数字
    }
    else return false;
  }

  public OnKeyDown(event: any) {
    var cur = this.current_focus_row;
    var keycode = window.event ? event.keyCode : event.which;   //获取按键编码
    if (keycode == 8) {         //退格
    }
    else if (keycode == 38) {   //上方向键
      this.PrevInput();
    }
    else if (keycode == 40) {   //下方向键
      this.NextInput(false);
    }
  }

  //判断输入数字是否正确并改变颜色和图标显示
  public Judge(index: number) {
    var right_row: boolean = false;
    if (parseFloat(this.input_rows[index]) == this.generated_num_rows[index]) {
      right_row = true;
      this.generated_num_rows_color[index] = NumCheckStatus.Right;
    }
    else {
      right_row = false;
      this.generated_num_rows_color[index] = NumCheckStatus.Wrong;
    }
    if (this.input_rows_check[index] == RowCheckStatus.Unchecked)
      this.all_row_count++;
    if (right_row) {
      this.input_rows_check[index] = RowCheckStatus.Right;
      this.right_row_count++;
      this.row_per_minute = this.right_row_count / (this.test_time - this.remain_seconds) * 60;
    }
    else {
      if (this.input_rows_check[index] == RowCheckStatus.Right) {
        this.right_row_count--;
      }
      this.input_rows_check[index] = RowCheckStatus.Wrong;
    }
  }

  //切换到下一个输入框
  public NextInput(enter: boolean = true): void {
    this.inputs[this.current_focus_row].blur();
    if (this.current_focus_row == 14) {
      if (enter) {
        this.RefreshNums();
        this.current_focus_row = 0;
      }
    }
    else {
      this.current_focus_row++;
    }
    //设置延时器，配合网页渲染
    setTimeout(() => { this.inputs[this.current_focus_row].focus(); }, 50);
  }

  //切换到上一个输入框
  public PrevInput(): void {
    this.inputs[this.current_focus_row].blur();
    if (this.current_focus_row != 0) {
      this.current_focus_row--;
    }
    //设置延时器，配合网页渲染
    setTimeout(() => { this.inputs[this.current_focus_row].focus(); }, 50);
  }

  //遍历一个对象属性并输出
  public Intercept(obj: any): string {
    var output: string = '';
    for (let prop in obj) {
      output += prop + '  ' + obj[prop] + '\n';
      output += '************' + prop + '************\n'
      let sub_elem = obj[prop];
      for (let sub_prop in sub_elem) {
        output += sub_prop + '  ' + sub_elem[sub_prop] + '\n';
        output += '-----------------------------\n';
      }
    }
    return output;
  }

}

interface MyResponse {
  msg: string;
}

interface MyStrPost {
  msg: string;
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

