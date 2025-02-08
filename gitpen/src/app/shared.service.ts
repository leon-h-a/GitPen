import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private fileDataSubject = new BehaviorSubject<Blob | null>(null);
  fileData$ = this.fileDataSubject.asObservable();

  constructor() { }

  setFileData(fileData: Blob) {
    this.fileDataSubject.next(fileData);
  }
}
