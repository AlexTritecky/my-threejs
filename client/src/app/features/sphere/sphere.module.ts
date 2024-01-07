import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SphereRoutingModule } from './sphere-routing.module';
import { SphereComponent } from './sphere/sphere.component';
import { SphereService } from './services/sphere.service';

@NgModule({
  declarations: [SphereComponent],
  imports: [CommonModule, SphereRoutingModule],
  providers: [SphereService],
})
export class SphereModule {}
