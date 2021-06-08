import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthData, LoginData } from '../models/auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }
  
  createUser(
    name: string,
    email: string,
    password: string
  ) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password,
    };
    this.http
      .post(`${this.SERVER_URL}/users/register`, authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const loginData: LoginData = {
      email: email,
      password: password
    }
    this.http
    .post(`${this.SERVER_URL}/users/login`, loginData)
    .subscribe((response) => {
      console.log(response);
    });
  }
}
