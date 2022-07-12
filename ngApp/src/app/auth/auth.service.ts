import { Injectable, OnInit } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';
import * as Keycloak from 'keycloak-js';



export class AuthService implements OnInit{
    keycloak = Keycloak({
        url: 'https://authqc.gc-solutions.net/',
        // url: 'http://localhost:8080/',
        // url:'http://10.0.2.2:8080/',
        realm: 'gcubedev',
        clientId: 'learnerweb'
        // realm: 'example',
        // clientId: 'cordova',
    });

    constructor(){}

    ngOnInit(): void {
        
    }

    AuthInit(){
        return new Promise((resolve, reject) =>{

            this.keycloak
                .init(/** @type {?} */ (({
                    onLoad: 'login-required',
                    adapter: 'cordova',
                    responseMode: 'query',
                    redirectUri: 'android-app://net.gcsolutions.lmsqc1/https/lmsqc1.gc-solutions.net/login',
                    // redirectUri: window.location.href, 
                })))
                .success(isAuth => {
                    console.log('auth service init success', isAuth);
                    resolve(isAuth)
                })
                .error(error => {
                    console.log('auth service init success', error);
                    reject('An error happened during Keycloak initialization.');
            });
        })
    }

    get isAuthenticated(){
        // this.keycloak.
        return this.keycloak.authenticated;
      }

    login(){
        this.keycloak
                .init(/** @type {?} */ (({
                    onLoad: 'login-required',
                    // adapter: 'cordova',
                    // responseMode: 'query',
                })))
                .success(isAuth => {
                    console.log('auth service login sucesss', isAuth);
                })
                .error(error => {
                    console.log('auth service login error', error);
                    console.log(error);
        });
    }

    refreshToken(){
        this.keycloak.isTokenExpired()
    }

    logout(){
        // this.keycloak.clearToken();
        this.keycloak
        .logout(/** @type {?} */ ({
            redirectUri: 'android-app://net.gcsolutions.lmsqc1/https/lmsqc1.gc-solutions.net/login',  
            // redirectUri: window.location.href
        }))
        .success(isAuth => {
            console.log('auth service logout success', isAuth);
            // resolve(isAuth);
        })
        .error(error => {
            // reject(error);
            console.log('auth service logout error', error);
        });
    }

    get token(){
        return this.keycloak.token;
    }

    get user(){
        return this.keycloak.tokenParsed;
    }

}

