import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';


interface Path {
  value: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatGridListModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  selectedPath: string = "";

  paths: Path[] = [
    {value: 'Main'},
    {value: 'Study'},
    {value: 'Logs'},
  ];
}
