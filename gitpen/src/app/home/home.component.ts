import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
    content: Blob | null = null;

    constructor(
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.sharedService.fileData$.subscribe(fileData => {
            this.content = fileData;
        });
    }
}
