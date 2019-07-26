import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElMessageService, ElNotificationService } from 'element-angular'

@Component({
  selector: 'app-check-records',
  templateUrl: './check-records.component.html',
})
export class CheckRecordsComponent {
  public records: Array<Record> = null;
  public comments: Array<Comment> = null;
  private http_client: HttpClient = null;
  private base_url: string = null;

  public input_content: string = '';
  public input_uname: string = '';
  public active_search: boolean = false;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string,
    private notify: ElNotificationService, private message: ElMessageService) {
    this.http_client = http;
    this.base_url = baseUrl;
    this.GetComments();
  }

  public GetComments() {
    this.http_client.get<Comment[]>(this.base_url + 'api/CheckRecords/GetComments').subscribe(
      data => this.comments = data,
      error => console.error(error));
  }

  public PostComment() {
    var comment: CommentSend = {
      uname: this.input_uname == '' ? '匿名' : this.input_uname,
      content: this.input_content,
    };
    this.http_client.post<MyResponse>(this.base_url + 'api/CheckRecords/RecvComment', comment).
      subscribe(response => this.message['success']('提交成功'), error => this.message['error']('提交失败'));
    this.comments = null;
    setTimeout(() => { this.GetComments(); }, 500);
  }

  public CheckRecords() {
    var uname: Uname = {
      uname: this.input_uname == '' ? '匿名' : this.input_uname,
    };
    this.http_client.post<Record[]>(this.base_url + 'api/CheckRecords/GetRecords', uname).
      subscribe(data => {
        this.records = data;
        this.active_search = true;
        this.message['success']('查询成功')
      }, error => this.message['error']('查询失败'));
  }

}

interface MyResponse {
  msg: string;
}

interface Comment {
  id: number,
  uname: string,
  content: string,
  datetime: string
}

interface CommentSend {
  uname: string,
  content: string,
}

interface Uname {
  uname: string
}

interface Record {
  id: number,
  uname: string,
  grade: number
}
