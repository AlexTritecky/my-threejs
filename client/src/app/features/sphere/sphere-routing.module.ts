import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SphereComponent } from './sphere/sphere.component';

const routes: Routes = [
  {
    path: '',
    component: SphereComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SphereRoutingModule {}
