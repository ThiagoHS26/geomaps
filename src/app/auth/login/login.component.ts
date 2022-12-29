import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /*Form login */
  public LoginForm = this._fb.group({
    email:[localStorage.getItem('email') || [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password:['',[Validators.required]],
    remember:[false]
  });
  formSubmitted = false;

  //Global variables
  public token:string;

  constructor(private _fb:FormBuilder, private _router:Router, private _authService:AuthService) { 
  }

  ngOnInit(): void {
  }
  
  //Login 
  login(){
    this.formSubmitted = true;
    if(this.LoginForm.invalid){
      return;
    }

    this._authService.login(this.LoginForm.value).subscribe(
      (res:any)=>{
        this.token = res.token;
        localStorage.setItem('token',this.token);
        if(this.LoginForm.get('remember').value){
          localStorage.setItem('email',this.LoginForm.get('email').value);
        }else{
          localStorage.removeItem('email');
        }
        this._router.navigate(['/dashboard/mapas']);
      },
      (err:any)=>{
        Swal.fire({
          icon:'error',
          title:'Error',
          text:err.error.message
        });
      }
    );

  }
  campoNoValido(campo:string):boolean{
    if(this.LoginForm.get(campo).invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

}
