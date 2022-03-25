import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServidorService } from 'src/app/services/servidor.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private servidor: ServidorService, private router: Router) { }

  ngOnInit(): void {
  }

  public email: any = "";
  public senha: any = "";

  public errorEmail: boolean = false;
  public errorSenha: boolean = false;
  public errorEntrar: boolean = false;

  entrar(){
    this.errorEmail = false, this.errorSenha = false, this.errorEntrar = false;

    if(this.email == null || this.email == ""){
      document.getElementById("txtEmail")?.focus();
      this.errorEmail = true;
      return;
    }

    if(this.senha == null || this.senha == ""){
      document.getElementById("txtSenha")?.focus();
      this.errorSenha = true;
      return;
    }

    this.servidor.post("https://h-api-ava.tindin.com.br/auth", {email:this.email, password:this.senha}).subscribe(res=>{
      sessionStorage.setItem("user", JSON.stringify(res));
      this.router.navigate(['/home']);
    }, erro=>{
      if(erro.status == 401){
        document.getElementById("txtEmail")?.focus();
        this.errorEntrar = true;
        return;
      }
    });
  }
}
