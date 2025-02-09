import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private fileDataSubject = new BehaviorSubject<string | null>(null);
  private fileNameSubject = new BehaviorSubject<string | null>(null);
  private filePathSubject = new BehaviorSubject<string | null>(null);

  fileData$ = this.fileDataSubject.asObservable();
  fileName$ = this.fileNameSubject.asObservable();
  filePath$ = this.filePathSubject.asObservable();

  editActive: boolean = false;

  constructor() { }

  toggleEdit() {
      this.editActive = !this.editActive;
  }

  setFileData(fileData: string) {
    this.fileDataSubject.next(fileData);
  }
  setFileName(fileName: string) {
    this.fileNameSubject.next(fileName);
  }
  setFilePath(filePath: string) {
    this.filePathSubject.next(filePath);
  }
}
