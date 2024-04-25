import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';



const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    ConfirmationService,
    ConfirmDialogModule
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
