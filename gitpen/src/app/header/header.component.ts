import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { SharedService } from '../shared.service';


interface FileItem {
  name: string;
  parent: string;
  type: 'file' | 'folder';
}

interface Folder extends FileItem {
  type: 'folder';
  expanded: boolean;
  children: FileStructure;
}

interface File extends FileItem {
  type: 'file';
}

type FileStructure = (File | Folder)[];


@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit{
    constructor(
        private api: ApiService,
        private sharedService: SharedService
    ) {}

    fileStructure: FileStructure = [];
    menuOpen = false;

    ngOnInit() {
        this.api.getAll().subscribe(resp => {
            this.fileStructure = resp;
        });
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    toggleFolder(item: any) {
        if (item.type === "folder") {
            item.expanded = !item.expanded;
        }
    }

    requestFile(filepath: string) {
        this.menuOpen = false;
        this.api.getFile(filepath).subscribe(resp => {
            this.sharedService.setFileName(resp.fileName);
            this.sharedService.setFileData(resp.fileContents);
            this.sharedService.setFilePath(resp.filePath);
        });
    }
}
