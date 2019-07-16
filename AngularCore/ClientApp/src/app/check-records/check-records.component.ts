import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Time } from '@angular/common';

@Component({
  selector: 'app-check-records',
  templateUrl: './check-records.component.html',
})
export class CheckRecordsComponent {
  public comments: Comment[];
  private httpClient: HttpClient = null;
  private baseUrl: string = null;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.httpClient = http;
    this.baseUrl = baseUrl;
    this.GetComments();
  }

  public GetComments() {
    this.httpClient.get<Comment[]>(this.baseUrl + 'api/CheckRecords/GetComments').subscribe(
      data => this.comments = data,
      error => console.error(error));
  }
}

interface Comment {
  id: number;
  uname: string;
  content: string;
  datetime: string;
}
