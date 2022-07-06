import { Injectable, OnInit } from "@angular/core";
import Keycloak, { KeycloakLoginOptions } from "keycloak-js";
import { v4 as uuidv4 } from 'uuid';


@Injectable({
    providedIn: 'root'
})

export class AuthService implements OnInit{
    keycloak = new Keycloak({
        // url: 'https://authqc.gc-solutions.net/',
        // url: 'http://localhost:8080',
        url:'http://10.0.2.2:8080/',
        // realm: 'gcubedev',
        // clientId: 'learnerweb'
        realm: 'example',
        clientId: 'cordova'
    });

    constructor(){}

    ngOnInit(): void {
        
    }

    AuthInit(){
        return new Promise((resolve, reject) =>{
            this.keycloak.init({
                // // onLoad: 'check-sso',
                // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                // onLoad: 'login-required',
                // redirectUri: window.location.href,
                // redirectUri: 'https://lmsqc1.gc-solutions.net/'
                // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                // // flow: 'hybrid'
    
               
                // adapter: 'cordova',
                // responseMode: 'query',
                // // onLoad: 'check-sso',
                // redirectUri: 'android-app://net.gcsolutions.lmsqc1/https/lmsqc1.gc-solutions.net',
                // silentCheckSsoRedirectUri: 'android-app://net.gcsolutions.lmsqc1/https/lmsqc1.gc-solutions.net',
                 // redirectUri: 'android-app://net.gcsolutions.lmsqc1/https/lmsqc1.gc-solutions.net',
                // adapter: 'cordova',
                // onLoad: 'check-sso',

                // browser
                // onLoad: 'login-required',
                // redirectUri: window.location.href,
                // // apps
                onLoad: 'login-required',
                adapter: 'cordova-native',
                responseMode: 'query',
                redirectUri: 'android-app://net.gcsolutions.lmsqc1/https/lmsqc1.gc-solutions.net/login', 
                // redirectUri: 'android-app://org.keycloak.examples.cordova/https/lmsqc1.gc-solutions.net/login'
                // redirectUri: 'android-app://org.keycloak.examples.cordova/https/keycloak-cordova-example.github.io/login'
            }).then(function(authenticated) {
                console.log(authenticated);
                resolve(authenticated);
            }).catch(function(e) {
                console.log(e);
                resolve(false);
            });
        })
    }

    get isAuthenticated(){
        console.log();
        // this.keycloak.
        return this.keycloak.authenticated;
      }

    login(){
        this.keycloak.login();
    }

    refreshToken(){
        this.keycloak.isTokenExpired()
    }

    loginByUrl(){
        const url = this.createLoginUrl({
            baseUrl: 'http://localhost:8080/',
            realm: 'example',
            clientId: 'cordova',
            redirectUri: 'http://localhost:4200/',
            responseMode:  'query',
            responseType: 'code',
            scope: 'openid'
        });
        console.log(url);
        return window.open(url, '_self');
    }

    logout(){
        this.keycloak.logout();
    }

    get token(){
        return this.keycloak.token;
    }

    get user(){
        return this.keycloak.tokenParsed;
    }

    

    private createLoginUrl(options: any) {
        console.log(options);
        const state = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        const nonce = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

        const baseUrl =  (options['baseUrl']  ? options['baseUrl'] :'http://localhost:4200/') as any;
        const realm =  options && options['realm'] ? options['realm'] :  '';
        console.log(realm);
        const clientId = options && options.clientId ? options.clientId : '';
        const redirectUri =  options && options['redirectUri'] && 'http://localhost:4200/';
        const responseMode = options && options['responseMode'] && 'query';  // 'query'|'fragment';
        const responseType = options && options['responseType'] && 'code'; // 'code'|'id_token token'|'code id_token token';
        const scope = options && options.scope || 'openid';

        let url = baseUrl 
            + 'realms/'+ realm 
            +'/protocol/openid-connect/auth'
            + '?client_id=' + encodeURIComponent(clientId)
            + '&redirect_uri=' + encodeURIComponent(redirectUri)
            + '&state=' + encodeURIComponent(state)
            + '&response_mode=' + encodeURIComponent(responseMode)
            + '&response_type=' + encodeURIComponent(responseType)
            + '&scope=' + encodeURIComponent(scope);

        if (nonce) {
            url = url + '&nonce=' + encodeURIComponent(nonce);
        }

        if (options && options.prompt) {
            url += '&prompt=' + encodeURIComponent(options.prompt);
        }

        if (options && options.maxAge) {
            url += '&max_age=' + encodeURIComponent(options.maxAge);
        }

        if (options && options.loginHint) {
            url += '&login_hint=' + encodeURIComponent(options.loginHint);
        }

        if (options && options.idpHint) {
            url += '&kc_idp_hint=' + encodeURIComponent(options.idpHint);
        }

        if (options && options.action && options.action != 'register') {
            url += '&kc_action=' + encodeURIComponent(options.action);
        }

        if (options && options.locale) {
            url += '&ui_locales=' + encodeURIComponent(options.locale);
        }

        return url;
    }

}

