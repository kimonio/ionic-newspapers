import {Component} from '@angular/core';
import {ActionSheetController, NavController} from 'ionic-angular';
import {INewspaper} from "../../providers/data/data.interface";
import {FavoritesProvider} from "../../providers/favorites/favorites.provider";
import {UtilityProvider} from "../../providers/utility/utility.provider";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  newspapers: INewspaper[] = [];
  isFavoritesLoaded: boolean = false;

  constructor(public navCtrl: NavController,
              public actionSheetCtrl: ActionSheetController,
              public favoritesProvider: FavoritesProvider,
              public utilityProvider: UtilityProvider) {
  }

  ionViewDidLoad() {
    this.loadFavorites();
  }

  addNewspaper() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Add Newspaper',
      buttons: [
        {
          text: 'Browse',
          handler: () => {
            this.browse();
          }
        }, {
          text: 'Search',
          handler: () => {
            this.search();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  browse() {
    this.navCtrl.push('BrowsePage');
  }

  search() {
    this.navCtrl.push('SearchPage');
  }

  loadFavorites() {
    this.favoritesProvider.getFavorites().then(newspapers => {
      this.newspapers = newspapers;
      this.isFavoritesLoaded = true;
    });
  }

  onNewspaperClick(newspaper: INewspaper) {
    const actionSheet = this.actionSheetCtrl.create({
      title: newspaper.name,
      buttons: [
        {
          text: 'View',
          handler: () => {
            this.utilityProvider.openBrowser(newspaper.url);
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.favoritesProvider.removeFavorite(newspaper)
              .then(_ => {
                this.loadFavorites();
                this.utilityProvider.presentToast("Removed Newspaper");
              })
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
