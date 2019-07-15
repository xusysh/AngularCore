import { Component } from '@angular/core';

@Component({
  selector: 'app-type-num',
  templateUrl: './type-num.component.html'
})
export class TypeNumComponent {
  public currentCount: number = 0;

  public incrementCounter() {
    this.currentCount++;
  }
}
