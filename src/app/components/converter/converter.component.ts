import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ConverterStore } from './converter.store';
import { CommonModule } from '@angular/common';
import {
	ReactiveFormsModule,
	FormGroup,
	FormBuilder,
	Validators,
	FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ErrorComponent } from '../error/error.component';
import { ConverterDisplayComponent } from "./converter-display/converter-display.component";

@Component({
	selector: 'app-converter',
	imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    ErrorComponent,
    ConverterDisplayComponent
],
	templateUrl: './converter.component.html',
	styleUrl: './converter.component.css',
	providers: [ConverterStore],
	encapsulation: ViewEncapsulation.None,
})
export class ConverterComponent implements OnInit {
	store = inject(ConverterStore);
	formBuilder = inject(FormBuilder);
	form!: FormGroup;

	ngOnInit() {
		this.form = this.formBuilder.group({
			toBeConverted: [1, [Validators.required, Validators.min(0.01)]],
			baseCurrency: ['AED', Validators.required],
			targetCurrency: ['AFN', Validators.required],
			currencyType: ['fiat', Validators.required],
		});
	}

	formSubmit() {
		this.store.convert({
			baseCurrency: this.form.get('baseCurrency')?.value,
			targetCurrency: this.form.get('targetCurrency')?.value,
			amount: this.form.get('toBeConverted')?.value,
		});
	}
}
