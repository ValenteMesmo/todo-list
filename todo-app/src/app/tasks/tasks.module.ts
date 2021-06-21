import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TaskEditComponent } from "./edit/task-edit.component";
import { TaskListComponent } from "./list/task-list.component";

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent
  },
  {
    path: ':id/edit',
    component: TaskEditComponent
  },
  {
    path: 'new',
    component: TaskEditComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [
    TaskListComponent,
    TaskEditComponent
  ]
})
export class TasksModule { }
