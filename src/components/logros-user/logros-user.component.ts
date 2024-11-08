import {Component, Input, OnInit} from '@angular/core';
import {Achievement} from '../../Model/Interfaces/Achievement';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-logros-user',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './logros-user.component.html',
  styleUrl: './logros-user.component.css'
})
export class LogrosUserComponent implements OnInit{

  @Input() achievements: Achievement[] = [];


  ngOnInit(): void {
    console.log(this.achievements)
  }

}
