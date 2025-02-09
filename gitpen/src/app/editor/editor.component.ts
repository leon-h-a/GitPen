import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { SharedService } from '../shared.service';
import { QuillEditorComponent } from 'ngx-quill';
import { ApiService } from '../api.service';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import markdownit from "markdown-it"


@Component({
    selector: 'app-editor',
    standalone: true,
    imports: [
        QuillModule,
        FormsModule,
        ReactiveFormsModule,
        QuillEditorComponent
    ],
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.scss',
})
export class EditorComponent {
    @ViewChild('editor') editor: any;
    @ViewChild(QuillEditorComponent) quillEditor!: QuillEditorComponent;
    content: string | null = null;
    filePath: string | null = null;
    fileName: string | null = null;
    private isTouching: boolean = false;
    private md = new markdownit({
        html: true,
        linkify: true,
        typographer: true
    });

    constructor(
        public sharedService: SharedService,
        private api: ApiService,
    ) { }

    editorModules = {
        toolbar: [
            [{ 'header': '1' }],
            [{ 'header': '2' }],
            [{ 'header': '3' }],
            [{ 'header': '4' }],
            ['code'],
            [{ 'list': 'ordered'}],
            [{ 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link'],
            ['image']
        ]
    };

    ngOnInit() {
        this.sharedService.fileData$.subscribe(fileData => {
            this.content = this.convertTextToHtml(fileData);
        });
        this.sharedService.filePath$.subscribe(filePath => {
            this.filePath = filePath;
        });
        this.sharedService.fileName$.subscribe(fileName => {
            this.fileName = fileName;
        });
    }

    ngAfterViewInit() {
        const icons = Quill.import('ui/icons') as Record<string, any>;
        icons['header']['1'] = '<i class="fas fa-header" style="color: white;">1</i>';
        icons['header']['2'] = '<i class="fas fa-header" style="color: white;">2</i>';
        icons['header']['3'] = '<i class="fas fa-header" style="color: white;">3</i>';
        icons['header']['4'] = '<i class="fas fa-header" style="color: white;">4</i>';
        icons['bold'] = '<i class="fas fa-bold" style="color: white;"></i>';
        icons['italic'] = '<i class="fas fa-italic" style="color: white;"></i>';
        icons['underline'] = '<i class="fas fa-underline" style="color: white;"></i>';
        icons['strike'] = '<i class="fas fa-strikethrough" style="color: white;"></i>';
        icons['code'] = '<i class="fas fa-code" style="color: white;"></i>';
        icons['list']['ordered'] = '<i class="fas fa-list-ol" style="color: white;"></i>';
        icons['list']['bullet'] = '<i class="fas fa-list-ul" style="color: white;"></i>';
        icons['link'] = '<i class="fas fa-link" style="color: white;"></i>';
        icons['image'] = '<i class="fas fa-image" style="color: white;"></i>';
    }

    convertTextToHtml (text: string | null): string | null {
        if (text) {
            return this.md.render(text);
        } else {
            return null;
        }
    }

    handleTouchEdit (event: TouchEvent) {
        if (this.isTouching) {
            if (this.sharedService.editActive) {
                if (this.content && this.filePath){
                    this.api.saveFile(this.content, this.filePath).subscribe(resp => {
                        this.sharedService.setFileData(resp.content);
                        this.sharedService.editActive = false;
                    });
                }
            }
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
