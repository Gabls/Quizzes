import { Component, OnInit } from '@angular/core';
import { ServidorService } from 'src/app/services/servidor.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private servidor: ServidorService, private route: Router){
    let json = JSON.parse(sessionStorage.getItem("user") || "{}");

    if(Object.keys(json).length == 0){
      this.route.navigate(["/login"]);
      return;
    }
    else{
      this.token = json["token"];
      this.nome = json["user"]["name"];
    }

    this.load();
  }

  ngOnInit(): void {
  }

  //#region Propriedades
  //#region Usuário
  private token: string = "";
  public nome:string = "";
  //#endregion

  //#region Quiz
  public titleQuiz:string = "";
  public listaQuiz:Array<any> = [];
  private id:any = {
    _id: ""
  };
  public quiz:any = {
    team: "623497e07ccb72a54717b9f4",
    title: "",
    description: "",
    type: "",
    level: "",
    rewardXp: 0,
    options: null
  };

  public opt:any = {
    text: "",
    correct: null
  };
  private lista:Array<object> = [];
  //#endregion

  //#region Erros
  public errorPage01:Array<any> = [{
    erro: false,
    title: "Digite o Título, por favor!",
  }, {
    erro: false,
    title: "Digite a Descrição, por favor!",
  }, {
    erro: false,
    title: "Selecione um Tipo, por faovr!",
  },  {
    erro: false,
    title: "Selecione uma Dificuldade, por favor!",
  }, {
    erro: false,
    title: "Selecione uma quantidade maior que 0, por favor!",
  }];

  public errorPage02:Array<any> = [{
    erro: false,
    title: "Digite um texto, por favor!",
  }, {
    erro: false,
    title: "Selecione uma das opções, por favor!",
  }];
  public errorOptions:boolean = false;
  //#endregion

  //#region General
  public updating:boolean = false;
  //#endregion
  //#endregion
  
  //#region Carregar lista de Quizzes
  load(){
    this.servidor.get("https://h-api-ava.tindin.com.br/quizzes?filter=team:623497e07ccb72a54717b9f4&fields=name,title,description,level,rewardXp,type", this.token).subscribe((dados: any)=>{
      this.listaQuiz = dados["quizzes"];
    });
  }
  //#endregion

  //#region Abrir a página "Adicionar Quiz"
  quizToggle(page:any){
    switch(page){
      case "add":
        if(this.updating){
          this.clear();
        }

        this.titleQuiz = "Novo Quiz!";
        this.updating = false;
        delete this.quiz._id;
        break;

      case "uptd":
        this.titleQuiz = "Atualizando!";
        this.updating = true;
        break;
    }

    $("#background").fadeToggle();
    $("#form").animate({width:'toggle'},450);
  }
  //#endregion

  //#region Trocar a página do "Adicionar Quiz"
  pageToggle(){
    $("#page01").fadeToggle();
    $("#page02").fadeToggle();    
  }
  //#endregion

  //#region Limpar os inputs
  clear(){
    this.quiz["title"] = "";
    this.quiz["description"] = "";
    this.quiz["type"] = "";
    this.quiz["level"] = "";
    this.quiz["rewardXp"] = 0;
    this.quiz["options"] = null;
  }
  //#endregion

  //#region Validação de valores
  empty(value: any){
    let erro = false;

    if(value == "" || value == 0 || value == null){
      erro = true;
    }

    return erro;
  }
  //#endregion

  //#region Avançar a página em "Adicionar Quiz"
  next(){
    //Limpar Erros
    this.errorPage01.forEach((i: any) => {
      i["erro"] = false;
    });

    //Validação
    let num = 0;
    for (let index = 0; index < Object.values(this.quiz).length; index++){
      const item = Object.keys(this.quiz)[index];
      const value = Object.values(this.quiz)[index];

      if(item != "team" && item && item != "options" && item != "_id"){
        if(this.empty(value)){
          $(`#txt${item.charAt(0).toUpperCase() + item.slice(1)}`).focus();
          this.errorPage01[num]["erro"] = true;
          return;
        }
        num++;
      }
    }

    //Trocar Página
    this.pageToggle();
  }
  //#endregion

  //#region Adicionar opções em "Adicionar Quiz"
  addOption(){
    //Limpar Erros
    this.errorPage02.forEach((i: any) => {
      i["erro"] = false;
    });

    //Validação
    for (let index = 0; index < Object.values(this.opt).length; index++){
      const item = Object.keys(this.opt)[index];
      const value = Object.values(this.opt)[index];

      if(this.empty(value)){
        $(`#txt${item.charAt(0).toUpperCase() + item.slice(1)}`).focus();
        this.errorPage02[index]["erro"] = true;
        return;
      }
    }

    //Salvando informação
    if(this.quiz["options"] != null){
      this.lista = this.quiz["options"];
    }

    this.lista.push({text: this.opt["text"], correct: this.opt["correct"]});
    this.quiz["options"] = this.lista;
  }
  //#endregion

  //#region Remover opções em "Adicionar Quiz"
  deleteteOption(id:number){
    this.lista = this.quiz["options"];
    this.lista.splice(id, 1);
    this.quiz["options"] = this.lista;
  }
  //#endregion

  //#region Enviar o quiz
  submit(){
    //Limpar erros
    this.errorOptions = false;

    //Validação
    if(this.quiz["options"] == null){
      this.errorOptions = true;
      return;
    }

    //Enviando
    this.servidor.post("https://h-api-ava.tindin.com.br/quizzes", this.quiz, this.token).subscribe(dados=>{
      this.clear();
      this.load();
      this.quizToggle(null);
      this.pageToggle();
    });
  }
  //#endregion

  //#region Editar um quiz
  edit(id:any){
    this.quizToggle("uptd");
    Object.assign(this.quiz, {_id:id});

    this.servidor.get(`https://h-api-ava.tindin.com.br/quizzes/${id}`, this.token).subscribe((dados: any) => {
      this.quiz["title"] = dados["quiz"]["title"];
      this.quiz["description"] = dados["quiz"]["description"];
      this.quiz["type"] = dados["quiz"]["type"];
      this.quiz["level"] = dados["quiz"]["level"];
      this.quiz["options"] = dados["quiz"]["options"];

      //Por algum motivo o rewardXp não está vindo quando puxo as informações, então eu decidi deixar um valor fixo
      this.quiz["rewardXp"] = 20 //dados["quiz"]["rewardXp"];
    });
  }
  //#endregion

  //#region Deletar um quiz
  delete(id: string){
    this.servidor.delete(`https://h-api-ava.tindin.com.br/quizzes/${id}`, this.token).subscribe(()=>{
      this.load();
    });
  }
  //#endregion

  //#region Atualizar o quiz
  update(){
    //Limpar erros
    this.errorOptions = false;

    //Validação
    if(this.quiz["options"] == null){
      this.errorOptions = true;
      return;
    }

    //Enviando
    this.servidor.put("https://h-api-ava.tindin.com.br/quizzes", this.quiz, this.token).subscribe(dados=>{
      this.clear();
      this.load();
      this.quizToggle(null);
      this.pageToggle();
    });
  }
  //#endregion
}