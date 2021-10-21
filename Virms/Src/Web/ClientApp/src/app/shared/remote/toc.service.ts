// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class TocService {

  constructor(
    private readonly http: HttpClient,
    @Inject('BASE_URL') private readonly baseUrl: string,
    @Inject('PROD_MODE') private readonly isProduction: boolean) {
  }

  getTableOfContent(): Observable<TocResponse> {

    if (this.isProduction) {
      //let request = 'https://live-phantoms.dynv6.net:8080/api/toc'
      //console.info(request)
      //return this.http.get<TocResponse>(request)

      return new Observable<TocResponse>(subscriber => {
        const tocFakeResponse: TocResponse = { hrefs: {} }
        tocFakeResponse.hrefs['motionsystems'] = 'https://live-phantoms.dynv6.net:8443/api/motionsystems'
        console.info(tocFakeResponse)
        subscriber.next(tocFakeResponse);
      })
    }
    else {
      //  let request = this.baseUrl + 'api/toc'
      //  console.info(request)
      //  return this.http.get<TocResponse>(request)

      return new Observable<TocResponse>(subscriber => {
        const tocFakeResponse: TocResponse = { hrefs: {} }
        tocFakeResponse.hrefs['motionsystems'] = this.baseUrl + 'api/motionsystems'
        console.info(tocFakeResponse)
        subscriber.next(tocFakeResponse);
      })
    }
  }

}

// Data Transfer Objects, Data Payload Objects

export interface TocResponse {
  hrefs: { [key: string]: string }
}
