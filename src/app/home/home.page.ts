import { Component, OnDestroy } from '@angular/core';
import { GlobalService } from '../service/global.service';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  message = '';
  subscription: Subscription;
  constructor(private globalService: GlobalService, private toast: ToastController) {
    this.subscription = this.globalService.getMessage().subscribe(badge => {
      if (badge) {
        this.presentToast(`The mentee badge status is ${badge.mentee}`);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async presentToast(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
