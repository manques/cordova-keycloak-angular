import { Component, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

declare let universalLinks: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges, OnDestroy{
  title = 'deeplink and auth server';
  token: string | null | undefined = null;
  user: any | null | undefined = null;
  url: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ){
    console.log('app constructor');
  }

  ngOnInit(): void {
    console.log('app init');
    this.user = this.authService.user;
    this.token = this.authService.token;

    this.authService.AuthInit()
    .then(isAuth => {
      console.log(isAuth);
      console.log(this.isAuthenticated);
      console.log(this.authService.keycloak.authenticated);
      this.ngZone.run(() => {
        this.updateToken(999);
      });
      if(isAuth){
        this.user = this.authService.user;
        this.token = this.authService.token;
      }
    });

   

    // universal link
    document.addEventListener('deviceready', () => {
      universalLinks.subscribe('keycloak', this.onDeeplinkRedirectPage);
    });
  }


  onDeeplinkRedirectPage = (evenData: any) => {
    console.log(evenData);
    console.log(this.authService.keycloak.isTokenExpired);
    console.log(this.authService.keycloak.token);
    this.url = evenData;

    this.authService.AuthInit()
    .then(isAuth => {
      if(isAuth){
        console.log(isAuth);
        console.log(this.authService.user);
        this.ngZone.run(() => {
          this.user = this.authService.user;
          this.token = this.authService.token;
        });
      }
    });

    

    this.onNavigateByUrl(evenData.path, evenData.params);
  }

  onNavigateByUrl = (path: string, params: any) => {
    console.log(path);
    console.log(params);
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

  ngOnChanges(changes: SimpleChanges): void {
    console.log('app onchange');
    // this.authService.AuthInit()
    // .then(isAuth => {
    //   if(isAuth){
    //     console.log(isAuth);
    //     console.log(this.authService.user);
    //     this.user = this.authService.user;
    //     this.token = this.authService.token;
    //   }
    // });
  }

  get isAuthenticated(){

    return this.authService.isAuthenticated;
  }

  ngOnDestroy(): void {
    console.log('app ondestroy');
    universalLinks.unsubscribe('onDeeplinkPage');
  }

  login(){
    this.authService.login();
  }

  logout(){
    this.authService.logout();
  }

  updateToken(number = 0){
  console.log(number);
    this.authService.keycloak.updateToken(number)
    .then((success) => {
      console.log(success);
      console.log(this.authService.keycloak.token);
    }).catch((err) => {
      console.log(err);
    });

  }
}
