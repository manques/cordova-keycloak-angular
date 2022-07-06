import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() {
    console.log('login constructor');
   }

  ngOnInit(): void {
    console.log('login init');
  }

}
