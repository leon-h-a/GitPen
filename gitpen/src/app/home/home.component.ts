import { ImageViewComponent } from '../image-view/image-view.component'; 
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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
    private isTouching: boolean = false;
    private isScrolling: boolean = false;
    private lastTapTime: number = 0;
    private lastTapX: number = 0;
    private lastTapY: number = 0;


    filename: string | null = null;
    filePath: string | null = null;
    fileType: string | null = null;
    content: string | null = null;
    private lastTap: number = 0;


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

    handleTouchEdit(event: TouchEvent) {
        if (!event.touches || event.touches.length === 0) {
            return;
        }

        const touch = event.touches[0];
        const currentTime = new Date().getTime();
        const tapX = touch.clientX;
        const tapY = touch.clientY;

        if (this.isScrolling) {
            return;
        }

        if (this.lastTapTime && currentTime - this.lastTapTime < 300) {
            const dx = Math.abs(tapX - this.lastTapX);
            const dy = Math.abs(tapY - this.lastTapY);

            if (dx < 100 && dy < 100) {
                this.sharedService.toggleEdit();
                this.isTouching = false;
                return;
            }
        }

        this.lastTapTime = currentTime;
        this.lastTapX = tapX;
        this.lastTapY = tapY;

        // Reset after a short delay
        setTimeout(() => {
            this.isTouching = false;
        }, 300);
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(event: TouchEvent) {
        this.isScrolling = true;
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event: TouchEvent) {
        setTimeout(() => {
            this.isScrolling = false;
        }, 200);
    }

    // handleTouchEdit (event: TouchEvent) {
    //     if (this.isTouching) {
    //         this.sharedService.toggleEdit();
    //         this.isTouching = false;
    //     } else {
    //         this.isTouching = true;
    //     }
    //     setTimeout(() => {
    //         this.isTouching = false;
    //     }, 300)
    // }
}
