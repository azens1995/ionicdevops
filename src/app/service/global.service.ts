import { Injectable } from '@angular/core';
import { interval, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private subject = new Subject<any>();
  counter = 0;

  constructor() {
    interval(6000).subscribe(next => (this.increaseCounter()));
   }

  sendMessage(badge: Badge) {
      this.subject.next(badge);
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }

  increaseCounter() {
    const badge = {
      mentee: true,
      mentor: false,
      home: true,
      community: false
    };

    this.sendMessage(badge);
    this.counter++;
  }
}
