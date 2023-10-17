import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { GameSettingsComponent } from './game-settings/game-settings.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'scoreboard', component: ScoreboardComponent },
  { path: 'game-settings', component: GameSettingsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
