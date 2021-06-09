import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  form!: FormGroup;
  imagePreview!: string;

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      price: new FormControl(null, [Validators.required]),
      count: new FormControl(null, [Validators.required]),
      details: new FormControl(null, [Validators.required]),
      plantCare: new FormControl(null, [Validators.required]),
    });
  }

  onImageSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onAddProduct() {
    if (this.form.invalid) {
      console.log('invalid form');
      ;
    }
    
    this.productService.createProduct(
      this.form.value.name,
      this.form.value.category,
      this.form.value.image,
      this.form.value.price,
      this.form.value.count,
      this.form.value.details,
      this.form.value.plantCare
    );
    this.form.reset();
  }
}
