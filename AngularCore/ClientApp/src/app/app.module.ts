import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ElModule } from 'element-angular'

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { TypeNumComponent } from './type-num/type-num.component';
import { TypeNumNormalComponent } from './type-num-normal/type-num-normal.component'
import { TypeChComponent } from './type-ch/type-ch.component';
import { CheckRecordsComponent } from './check-records/check-records.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    TypeNumComponent,
    TypeNumNormalComponent,
    TypeChComponent,
    CheckRecordsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    ElModule.forRoot(),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'type-num', component: TypeNumComponent },
      { path: 'type-num-normal', component: TypeNumNormalComponent },
      { path: 'type-ch', component: TypeChComponent },
      { path: 'check-records', component: CheckRecordsComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
