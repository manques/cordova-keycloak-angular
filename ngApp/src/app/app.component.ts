import { Component, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

declare let universalLinks: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,  OnDestroy{
  title = 'deeplink and auth server';
  token: string | null | undefined = null;
  user: any | null | undefined = null;
  url: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ){
  }

  ngOnInit(): void {

    this.authService.AuthInit()
    .then(isAuth => {
      console.log('app component auth init success', isAuth);
      this.ngZone.run(() => {
        this.updateToken(999);
      });
      console.log('app component auth init user', this.authService.user);
      console.log('app component auth init token', this.authService.token);
      if(isAuth){
        this.user = this.authService.user;
        this.token = this.authService.token;
      }
    }).catch(err => {
      console.log('app component auth init success', err);
    });

   

    // universal link
    document.addEventListener('deviceready', () => {
      universalLinks.subscribe('keycloak', this.onDeeplinkRedirectPage);
    });
  }


  onDeeplinkRedirectPage = (evenData: any) => {
    this.url = evenData;

    this.authService.AuthInit()
    .then(isAuth => {
      console.log('deeplink app component auth init success', isAuth);
      this.ngZone.run(() => {
        this.updateToken(999);
      });
      console.log('deeplink app component auth init user', this.authService.user);
      console.log('deeplink app component auth init token', this.authService.token);
      if(isAuth){
        this.user = this.authService.user;
        this.token = this.authService.token;
      }
    }).catch(err => {
      console.log('deeplink app component auth init success', err);
    });

    this.onNavigateByUrl(evenData.path, evenData.params);
  }

  onNavigateByUrl = (path: string, params: any) => {
    this.ngZone.run(() => {
      this.router.navigate(
        [path],
        {
          queryParams: params,
          queryParamsHandling: 'merge'
        }
      );
    });
  }

  get isAuthenticated(){

    return this.authService.isAuthenticated;
  }

  ngOnDestroy(): void {
    universalLinks.unsubscribe('onDeeplinkPage');
  }

  login(){
    this.authService.login();
  }

  logout(){
    this.authService.logout();
  }

  updateToken(number = 0){
    this.authService.keycloak.updateToken(number)
    .success((success) => {
    }).error((err) => {
      console.log(err);
    });

  }
}
