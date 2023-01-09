import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';

declare var $:any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  usuarios:User[]=[];
  user:any;
  token:string;

  /*Forms */
  public RegisterUserForm = this._fb.group({
    name:['',[Validators.required]],
    email:['',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password:['',[Validators.required]],
    passwordConfirm:['',[Validators.required]],
    role:['',[Validators.required]]
  },{
    validators: this.passwordIguales('password','passwordConfirm')
  });

  formSubmitted = false;
  editSubmitted = false;

  public EditUserForm = this._fb.group({
    name:['',[Validators.required]],
    email:['',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    role:['',[Validators.required]]
  });

  public ChangePassUser = this._fb.group({
    newPass:['',[Validators.required]],
    confirmPass:['',[Validators.required]]
  });

  constructor(private _userService:UserService, private _fb:FormBuilder) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.get_users();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };
  }

  get_users(){
    this._userService.get_all_users().subscribe(
      (res:any)=>{
        this.usuarios = res.users;
        this.dtTrigger.next();
      },
      (error:any)=>{
        console.log(error);
      }
    );
  }

  insertUser(){
    this.formSubmitted = true;
    if(this.RegisterUserForm.invalid){
      return;
    }
    this._userService.new_user(this.RegisterUserForm.value).subscribe(
      (res:any)=>{
        Swal.fire({
          icon:'success',
          title:'Éxito',
          text:res.message,
          confirmButtonText:'OK'
        }).then((result)=>{
          if(result.isConfirmed){
            location.reload();
          }
        });
      },
      (error:any)=>{
        Swal.fire({
          icon:'error',
          title:'Error',
          text:error.error.message,
          showConfirmButton:false,
          timer:1000
        });
      }
    );
  }

  cambiarPass(id:string){
    let idUserPass = id;
    $('#cambiarPass').modal('toggle');
    $('#cambiarPass').modal('show');
    localStorage.setItem('idUserPass',idUserPass);
  }
  changePassword(){
    this._userService.change_password(localStorage.getItem('idUserPass'),this.ChangePassUser.value).subscribe(
      (res:any)=>{
        Swal.fire({
          icon:'success',
          title:'Éxito',
          text:res.message,
          confirmButtonText:'OK'
        }).then((result)=>{
          if(result.isConfirmed){
            location.reload();
          }
        });
      },
      (error:any)=>{
        Swal.fire({
          icon:'error',
          title:'Error',
          text:error.error.message,
          showConfirmButton:false,
          timer:1000
        });
      }
    );
  }
  llenarForm(id:string){
    console.log(id);
    this._userService.get_user_by_id(id).subscribe(
      (res:any)=>{
        this.user = res.user;
        this.EditUserForm.setValue({
          name:this.user.name,
          email:this.user.email,
          role:this.user.role
        });
        $('#editarUsuario').modal('toggle');
        $('#editarUsuario').modal('show');
        localStorage.setItem('idUser', this.user._id);
      },
      (error:any)=>{
        console.log(error);
      }
    );
  }

  editUser(){
    this.editSubmitted = true;
    if(this.EditUserForm.invalid){
      return;
    }
    this._userService.edit_user(localStorage.getItem('idUser'),this.EditUserForm.value).subscribe(
      (res:any)=>{
        Swal.fire({
          icon:'success',
          title:'Éxito',
          text:res.message,
          confirmButtonText:'OK'
        }).then((result)=>{
          if(result.isConfirmed){
            location.reload();
            localStorage.removeItem('idUser');
          }
        });
      },
      (error:any)=>{
        Swal.fire({
          icon:'error',
          title:'Error',
          text:error.error.message,
          showConfirmButton:false,
          timer:1000
        });
      }
    )
  }

  campoNoValidoFormEdit(campo:string){
    if(this.EditUserForm.get(campo).invalid && this.editSubmitted){
      return true;
    }else{
      return false;
    }
  }

  eliminarUsuario(id:string){
    Swal.fire({
      icon:'question',
      title:'Seguro que quieres eliminar este usuario?',
      showCancelButton:true,
      confirmButtonText:'Si'
    }).then((result)=>{
      if(result.isConfirmed){
        this._userService.delete_user(id).subscribe(
          (res:any)=>{
            Swal.fire({
              icon:'success',
              title:'Éxito',
              text:res.message,
              showConfirmButton:false,
              timer:1000
            }).then((result)=>{
              if(result){
                location.reload();
              }
            });
          },
          (error:any)=>{
            Swal.fire({
              icon:'error',
              title:'Error',
              text:error.error.message,
              showConfirmButton:false,
              timer:1000
            });
          }
        );
      }
    });
    
  }

  campoNoValido(campo:string){
    if(this.RegisterUserForm.get(campo).invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  passwordIguales(pass1Name:string, pass2Name:string){
    return (formGroup : FormGroup)=>{
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if(pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({noEsIgual:true});
      }

    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    localStorage.removeItem('idUser');
  }

}
