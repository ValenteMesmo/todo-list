import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { ChronometerComponent } from "./chronometer/chronometer.component";
import { CurrentTaskComponent } from "./current-task/current-task.component";
import { HomeComponent } from "./home.component";
import { NewTaskFormComponent } from "./new-task-form/new-task-form.component";
import { TaskListComponent } from "./task-list/task-list.component";
import { TimelineComponent } from "./timeline/timeline.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
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
    HomeComponent
    , ChronometerComponent
    , TimelineComponent
    , CurrentTaskComponent
    , NewTaskFormComponent
    , TaskListComponent
  ]
})
export class HomeModule { }
