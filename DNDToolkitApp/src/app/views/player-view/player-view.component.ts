import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService, SocketService } from '../../services';
import { Subscription } from 'rxjs';
import { PlayerModel } from 'src/app/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.css']
})
export class PlayerViewComponent implements OnInit {

  subscriptions : Subscription[] = [];
  playerDataForm : FormGroup;
  connectToDMForm : FormGroup;
  me : PlayerModel;
  id : String = Date.now().toString();
  connectedToDM : Boolean = false;
  playerDataCollected : Boolean = false;

  constructor(
    private http : HttpService,
    private socket : SocketService,
    private router : Router) { }

  ngOnInit() {
    this.me = new PlayerModel();

    if (sessionStorage.getItem('player') !== null) {
      this.me = JSON.parse(sessionStorage.getItem('player'));
      this.playerDataCollected = true;
    }



    this.playerDataForm = new FormGroup({
      playerName: new FormControl(''),
      characterName: new FormControl(''),
      initiativeBonus: new FormControl(''),
      currentHitPoints: new FormControl(''),
      maximumHitPoints: new FormControl('')
    });
    this.connectToDMForm = new FormGroup({
      room: new FormControl('')
    })
  }

  connect() {
    this.socket.connect(this.connectToDMForm.controls.room.value);
    sessionStorage.setItem('room', this.connectToDMForm.controls.room.value.toString());
    this.socket.playerConnected(this.me);
    this.connectedToDM = true;

    this.subscriptions.push(this.socket.onCombatBegin().subscribe(() => {
      this.router.navigate(['player/encounter']);
    }));
  }

  updateMe() {
    this.playerDataCollected = true;

    this.me.id = this.id;
    this.me.combatantName = this.playerDataForm.controls.characterName.value;
    this.me.playerName = this.playerDataForm.controls.playerName.value;
    this.me.initiativeBonus = this.playerDataForm.controls.initiativeBonus.value;
    this.me.currentHitPoints = this.playerDataForm.controls.currentHitPoints.value;
    this.me.maximumHitPoints = this.playerDataForm.controls.maximumHitPoints.value;
    
    console.log(this.me);
    sessionStorage.setItem('player',JSON.stringify(this.me));
  }

  editPlayerInfo() {
    this.playerDataCollected = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

}
