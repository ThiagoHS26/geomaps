import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public token:string;
  constructor() { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
  }
  logout(){
    localStorage.removeItem('token');
    location.reload();
  }

}
