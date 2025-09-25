import { Routes } from '@angular/router';
import { ConverterComponent } from './components/converter/converter.component';
import { ConverterModule } from './components/converter/converter/converter.module';

export const routes: Routes = [
  {
    path: '',
    component: ConverterComponent,
    loadChildren: () =>
      import('./components/converter/converter/converter.module').then(
        (m) => ConverterModule,
      ),
  },
];
