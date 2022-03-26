import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServidorService } from 'src/app/services/servidor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private servidor: ServidorService, private router: Router){
    let json = JSON.parse(sessionStorage.getItem("user") || "{}");
    this.token = json["token"];
    this.nome = json["user"]["name"];

    this.servidor.get("https://h-api-ava.tindin.com.br/quizzes?filter=team:623497e07ccb72a54717b9f4&fields=name,title,description,level,rewardXp,type", this.token).subscribe(res=>{
      this.lista = res;
      this.lista = this.lista["quizzes"];
      console.log(this.lista);
    });
  }

  ngOnInit(): void {
  }

  private token: string = "";
  public nome:string = "";

  public lista:any = [];
}
