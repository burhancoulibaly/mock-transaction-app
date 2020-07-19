import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authCheck: boolean = false;

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    
    return new Promise((resolve, reject) => {
      this.authService.authChange
      .subscribe((val) => {
        this.authCheck = val;
        resolve(this.checkAuth(url));
      })
    })
  }

  checkAuth(url): boolean | UrlTree{
    console.log(this.authCheck);
    if(url == "/login" || url == "/signup"){
      if(this.authCheck){
        this.router.navigate(['home']);
        return false;
      }

      return true;
    }
    
    if(this.authCheck){
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}