import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { TextComponent } from './text/text.component';

const routes: Routes = [
  { path: 'chat', component: ChatComponent, data: { title: 'Chat' } },
  { path: 'text', component: TextComponent, data: { title: 'Text' } },
  { path: '', redirectTo: '/chat', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
