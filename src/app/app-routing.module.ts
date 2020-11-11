import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoingPageComponent } from './pages/doing-page/doing-page';
import { TodoPageComponent } from './pages/todo-page/todo-page';

const routes: Routes = [
  { path: '', redirectTo: '/todo', pathMatch: 'full' }
  , { path: 'doing', component: DoingPageComponent }
  , { path: 'todo', component: TodoPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
