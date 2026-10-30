import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http'

@NgModule({ declarations: [], imports: [CommonModule], providers: [provideHttpClient(withXhr(), withInterceptorsFromDi())] })
export class SharedModule { }
