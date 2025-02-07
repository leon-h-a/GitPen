import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


interface Path {
    value: string;
}

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})

export class HeaderComponent {
    menuOpen = false;

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }
    toggleFolder(item: any) {
        if (item.type === "folder") {
            item.expanded = !item.expanded;
        }
    }

    fileStructure = [
        {
            name: "Documents",
            type: "folder",
            expanded: false,
            children: [
                {
                    name: "Notes",
                    type: "folder",
                    expanded: false,
                    children: [
                        { name: "meeting-notes.md", type: "file" },
                        { name: "todo-list.txt", type: "file" }
                    ]
                },
                {
                    name: "Projects",
                    type: "folder",
                    expanded: false,
                    children: [
                        { name: "angular-guide.pdf", type: "file" },
                        { name: "backend-spec.docx", type: "file" }
                    ]
                }
            ]
        },
        {
            name: "Images",
            type: "folder",
            expanded: false,
            children: [
                {
                    name: "Vacation",
                    type: "folder",
                    expanded: false,
                    children: [
                        { name: "beach.jpg", type: "file" },
                        { name: "mountain.png", type: "file" }
                    ]
                },
                { name: "logo.svg", type: "file" }
            ]
        },
        { name: "readme.md", type: "file" },
        { name: "config.json", type: "file" }
    ];
}
