import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoingPageComponent } from './pages/doing-page/doing-page';
import { TodoPageComponent } from './pages/todo-page/todo-page';
import { PLANNING_ROUTE, DOING_ROUTE_NAME, PLANNING_ROUTE_NAME, REPOSITORY_NAME } from './shared/route-constants';

const routes: Routes = [
  { path: '', redirectTo: PLANNING_ROUTE, pathMatch: 'full' }
  , { path: REPOSITORY_NAME, redirectTo: PLANNING_ROUTE, pathMatch: 'full' }
  , { path: DOING_ROUTE_NAME, component: DoingPageComponent }
  , { path: PLANNING_ROUTE_NAME, component: TodoPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
