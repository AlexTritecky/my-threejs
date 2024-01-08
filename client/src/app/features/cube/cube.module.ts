import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CubeRoutingModule } from './cube-routing.module';
import { CubeComponent } from './cube/cube.component';
import { CubeService } from './service/cube.service';

@NgModule({
  declarations: [CubeComponent],
  imports: [CommonModule, CubeRoutingModule],
  providers: [CubeService],
})
export class CubeModule {}
