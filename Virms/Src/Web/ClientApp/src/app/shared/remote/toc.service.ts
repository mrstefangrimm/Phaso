// Copyright (c) 2020-2022 Stefan Grimm. All rights reserved.
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
      return new Observable<TocResponse>(subscriber => {
        const tocFakeResponse: TocResponse = { hrefs: {} }
        tocFakeResponse.hrefs['motionsystems'] = 'https://webaepp.dynv6.net:50445/api/motionsystems'
        tocFakeResponse.hrefs['liveimage'] = 'https://webaepp.dynv6.net:50445/images'
        console.info(tocFakeResponse)
        subscriber.next(tocFakeResponse)
      })
    }
    else {
      return new Observable<TocResponse>(subscriber => {
        const tocFakeResponse: TocResponse = { hrefs: {} }
        tocFakeResponse.hrefs['motionsystems'] = this.baseUrl + 'api/motionsystems'
        console.info(tocFakeResponse)
        subscriber.next(tocFakeResponse)
      })
    }
  }

}

// Data Transfer Objects, Data Payload Objects

export interface TocResponse {
  hrefs: { [key: string]: string }
}
