import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule }   from './app/app.module';
import { environment } from './environments/environment';
import {toJS}          from "mobx";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
                        .catch(err => console.error(err));


export const js=(param:any)=>toJS(param, {recurseEverything: true});
window['js']=js;
