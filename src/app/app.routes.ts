import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; 
import { LoginComponent } from './components/login/login.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskSuggestionComponent } from './components/task-suggestion/task-suggestion.component';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'task-form', component: TaskFormComponent, canActivate: [AuthGuard] },
  { path: 'task-list/:userId', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'task-suggestion', component: TaskSuggestionComponent, canActivate: [AuthGuard] },
  { path: 'task-view', component: TaskViewComponent, canActivate: [AuthGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] }
];