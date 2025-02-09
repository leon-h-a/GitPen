import { ImageViewComponent } from '../image-view/image-view.component'; 
import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorComponent } from '../editor/editor.component'; 
import { SharedService } from '../shared.service';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        MarkdownModule,
        CommonModule,
        ImageViewComponent,
        EditorComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
    filename: string | null = null;
    filePath: string | null = null;
    fileType: string | null = null;
    content: string | null = null;
    private lastTap: number = 0;
    private isTouching: boolean = false;


    constructor(
        public sharedService: SharedService,
        private title: Title
    ) { }

    @ViewChild(ImageViewComponent) imageView!: ImageViewComponent;

    ngOnInit() {
        this.sharedService.fileData$.subscribe(fileData => {
            this.content = fileData;
        });
        this.sharedService.filePath$.subscribe(filePath => {
            this.filePath = filePath;
        });
        this.sharedService.fileName$.subscribe(fileName => {
            this.filename = fileName;

            if (this.filename) {
                if (this.filename.includes('txt')) {
                    this.fileType = "text";
                } else if (this.filename.includes('md')) {
                    this.fileType = "markdown";
                }
            }
            if (this.filename) {
                this.title.setTitle("GitPen - " + this.filename);
            } else {
                this.title.setTitle("GitPen");
            }
        });
    }

    markdownClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'img') {
            const imageUrl = target.getAttribute('src');
            if (imageUrl) {
                this.imageView.OpenModal(imageUrl);
            }
        }
    }

    handleClickEdit (event: Event) {
        this.sharedService.toggleEdit();
    }

    handleTouchEdit (event: TouchEvent) {
        if (this.isTouching) {
            this.sharedService.toggleEdit();
            this.isTouching = false;
        } else {
            this.isTouching = true;
        }
        setTimeout(() => {
            this.isTouching = false;
        }, 300)
    }
}
