import { Component, Inject, ElementRef, ViewChildren, ViewChild, QueryList, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElNotificationService } from 'element-angular'
import { ElMessageService } from 'element-angular'

@Component({
  selector: 'app-type-num',
  templateUrl: './type-num.component.html'
})
export class TypeNumComponent {
  //控制测试界面元素
  public row_count: number = 15;
  public test_time: number = 180;
  public min: number = 0;
  public sec: number = 0;
  //测试数据&业务逻辑
  public uname: string = '';
  public row_per_minute: number = 0;
  public right_row_count: number = 0;
  public remain_seconds: number = 0;
  public start_count: boolean = false;
  public end_count: boolean = false;
  //控制界面元素显示
  public generated_num_rows: Array<NumRow> = new Array<NumRow>(this.row_count);
  public generated_num_rows_color: Array<NumRowColor> = new Array<NumRowColor>(this.row_count);
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
    this.right_row_count = 0;
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
    if (this.remain_seconds > 0) {
      setTimeout(() => {
        this.CountDown()
      }, 1000);
    }
    else {      //时间到，测试结束
      this.start_count = false;
      this.end_count = true;
      this.row_per_minute = this.right_row_count / (this.test_time - this.remain_seconds) * 60;
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
      if (this.input_rows[cur].length == 3 || this.input_rows[cur].length == 8)
        this.input_rows[cur] += ", ";
    }
    else return false;
  }

  public OnKeyDown(event: any) {
    var cur = this.current_focus_row;
    var keycode = window.event ? event.keyCode : event.which;   //获取按键编码
    if (keycode == 8) {         //退格
      if (this.input_rows[cur].length == 5 || this.input_rows[cur].length == 10)
        this.input_rows[cur] = this.input_rows[cur].substring(0, this.input_rows[cur].length - 2);
    }
  }

  //判断输入数字是否正确并改变颜色和图标显示
  public Judge(index: number) {
    var input_nums = this.input_rows[index].split(', ');
    var generated_nums = this.generated_num_rows[index];
    var row_color = this.generated_num_rows_color[index];
    var i: number = 0;
    var right_row: boolean = true;
    for (var prop in generated_nums) {
      if (parseFloat(input_nums[i]) == generated_nums[prop])
        row_color[prop + '_color'] = NumCheckStatus.Right;
      else {
        row_color[prop + '_color'] = NumCheckStatus.Wrong;
        right_row = false;
      }
      i++;
    }
    if (right_row) {
      this.input_rows_check[index] = RowCheckStatus.Right;
      this.right_row_count++;
      this.row_per_minute = this.right_row_count / (this.test_time - this.remain_seconds) * 60;
    }
    else {
      this.input_rows_check[index] = RowCheckStatus.Wrong;
    }
  }

  //切换到下一个输入框
  public NextInput(): void {
    this.inputs[this.current_focus_row].blur();
    if (this.current_focus_row == 14) {
      this.RefreshNums();
      this.current_focus_row = 0;
    }
    else {
      this.current_focus_row++;
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

