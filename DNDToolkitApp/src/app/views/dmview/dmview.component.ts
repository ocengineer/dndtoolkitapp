import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { SocketService } from 'src/app/services';
import { Subscription } from 'rxjs';
import { CombatantModel } from 'src/app/models';

@Component({
  selector: 'app-dmview',
  templateUrl: './dmview.component.html',
  styleUrls: ['./dmview.component.css']
})
export class DMViewComponent implements OnInit, OnDestroy {

  subscriptions : Subscription[] = [];
  room : String;
  combatants : any[] = []; 

  constructor(private socket : SocketService) { }

  ngOnInit() {
    this.room = sessionStorage.getItem('dmkey');

    this.socket.connect(this.room);

    this.subscriptions.push(this.socket.onPlayerConnect().subscribe(player => {
      this.combatants.push(player);
      console.log(this.combatants);
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

}
