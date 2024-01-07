import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { HomeService } from './service/home.service';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule],
  providers: [HomeService],
})
export class HomeModule {}
