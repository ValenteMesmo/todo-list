import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TasksComponent } from "./tasks.component";

const routes: Routes = [
  {
    path: '',
    component: TasksComponent
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
    TasksComponent
  ]
})
export class TasksModule { }
