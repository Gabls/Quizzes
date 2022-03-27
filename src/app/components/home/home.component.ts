import { Component, OnInit } from '@angular/core';
import { ServidorService } from 'src/app/services/servidor.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private servidor: ServidorService){
    let json = JSON.parse(sessionStorage.getItem("user") || "{}");
    this.token = json["token"];
    this.nome = json["user"]["name"];

    this.load();
  }

  ngOnInit(): void {
  }

  private id:string = "";
  private token: string = "";
  public nome:string = "";
  public listaItens:any = [];
  private listaAtt:any = [];
  public tituloQuiz:string = "";
  public atualizando:boolean = false;

  //Page 01
  private team:string = "623497e07ccb72a54717b9f4";
  public titulo:string = "";
  public descricao:string = "";
  public dificuldade:string = "";
  public tipo:string = "";
  public xp:number = 0;

  public errorTitulo:boolean = false;
  public errorDescricao:boolean = false;
  public errorDificuldade:boolean = false;
  public errorTipo:boolean = false;
  public errorXp:boolean = false;

  //Page 02
  public texto:string = "";
  public correcao:any;
  public questoes:any;
  private lista:Array<object> = [];

  public errorTexto:boolean = false;
  public errorCorreao:boolean = false;
  public errorOpcao:boolean = false;

  load(){
    this.servidor.get("https://h-api-ava.tindin.com.br/quizzes?filter=team:623497e07ccb72a54717b9f4&fields=name,title,description,level,rewardXp,type", this.token).subscribe(res=>{
      this.listaItens = res;
      this.listaItens = this.listaItens["quizzes"];
    });
  }

  quizToggle(){
    this.tituloQuiz = "Novo QuiZ!";
    this.atualizando = false;

    $("#background").fadeToggle();
    $("#form").animate({width:'toggle'},450);
  }

  pageToggle(){
    $("#page01").fadeToggle();
    $("#page02").fadeToggle();    
  }

  editar(id:string){
    this.quizToggle();
    this.tituloQuiz = "Atualizando!";
    this.id = id;
    this.atualizando = true;

    this.servidor.get(`https://h-api-ava.tindin.com.br/quizzes/${id}`, this.token).subscribe(res=>{
      this.listaAtt = res;
      this.titulo = this.listaAtt["quiz"]["title"];
      this.descricao = this.listaAtt["quiz"]["description"];
      this.dificuldade = this.listaAtt["quiz"]["level"];
      this.tipo = this.listaAtt["quiz"]["type"];
      this.questoes = this.listaAtt["quiz"]["options"];
    });
  }

  excluir(id: string){
    this.servidor.delete(`https://h-api-ava.tindin.com.br/quizzes/${id}`, this.token).subscribe(()=>{
      this.load();
    });
  }

  avancar(){
    this.errorTitulo = false, this.errorDescricao = false, this.errorTipo = false, this.errorDificuldade = false, this.errorXp = false;

    if(this.titulo == ""){
      $("#txtTitulo").focus();
      this.errorTitulo = true;
      return;
    }
    if(this.descricao == ""){
      $("#txtDesricao").focus();
      this.errorDescricao = true;
      return;
    }
    if(this.tipo == ""){
      $("#txtTipo").focus();
      this.errorTipo = true;
      return;
    }
    if(this.dificuldade == ""){
      $("#txtDificuldade").focus();
      this.errorDificuldade = true;
      return;
    }
    if(this.xp <= 0){
      $("#txtXp").focus();
      this.errorXp = true;
      return;
    }

    this.pageToggle();
  }

  adicionarQuestao(){
    this.errorTexto = false, this.errorCorreao = false;

    if(this.texto == ""){
      $("#txtTexto").focus();
      this.errorTexto = true;
      return;
    }
    if(this.correcao == null){
      $("#txtCorrecao").focus();
      this.errorCorreao = true;
      return;
    }

    if(this.questoes != null){
      this.lista = this.questoes;
    }

    this.lista.push({correct:this.correcao, text:this.texto});
    this.questoes = this.lista;
  }

  removerQuestao(id:number){
    this.lista = this.questoes;
    this.lista.splice(id, 1);
    this.questoes = this.lista;
  }

  enviar(){
    this.errorOpcao = false;

    if(this.questoes == null){
      this.errorOpcao = true;
      return;
    }

    let data = {team:this.team, title:this.titulo, description:this.descricao, level:this.dificuldade, type:this.tipo, rewardXp:this.xp, options:this.questoes}
    this.servidor.post("https://h-api-ava.tindin.com.br/quizzes", data, this.token).subscribe(res=>{
      this.titulo = "", this.descricao = "", this.dificuldade = "", this.tipo = "", this.xp = 0, this.questoes = null, this.texto = "", this.correcao = null;
      this.load();
      this.quizToggle();
      this.pageToggle();
    });
  }

  atualizar(){
    this.errorOpcao = false;

    if(this.questoes == null){
      this.errorOpcao = true;
      return;
    }

    let data = {_id: this.id, team:this.team, title:this.titulo, description:this.descricao, level:this.dificuldade, type:this.tipo, rewardXp:this.xp, options:this.questoes}
    this.servidor.put(`https://h-api-ava.tindin.com.br/quizzes/${this.id}`, data, this.token).subscribe(res=>{
      this.titulo = "", this.descricao = "", this.dificuldade = "", this.tipo = "", this.xp = 0, this.questoes = null, this.texto = "", this.correcao = null;
      this.atualizando = false;
      this.load();
      this.quizToggle();
      this.pageToggle();
    });
  }
}
