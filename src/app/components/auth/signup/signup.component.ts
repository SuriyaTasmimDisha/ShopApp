import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(public userService: UserService) {}

  ngOnInit(): void { }
  
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.userService.createUser(
      form.value.name,
      form.value.email,
      form.value.password
    );
  }
}
