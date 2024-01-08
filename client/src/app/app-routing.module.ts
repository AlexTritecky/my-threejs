import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'sphere',
    loadChildren: () =>
      import('./features/sphere/sphere.module').then((m) => m.SphereModule),
  },
  {
    path: 'cube',
    loadChildren: () =>
      import('./features/cube/cube.module').then((m) => m.CubeModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
