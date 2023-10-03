import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { TextComponent } from './text/text.component';
import { ReadComponent } from './read/read.component';
import { CustomRouteReuseStrategy } from './reuse-strategy.routing';

const routes: Routes = [
  { path: 'chat', component: ChatComponent, data: { title: 'Chat' } },
  { path: 'text', component: TextComponent, data: { title: 'Text' } },
  { path: 'voice', component: ReadComponent, data: { title: 'Voice' } },
  { path: '', redirectTo: '/chat', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: CustomRouteReuseStrategy,
  },]
})
export class AppRoutingModule { }
