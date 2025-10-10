import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConverterStore } from '../converter.store';
import { DecimalPipe } from '@angular/common';

@Component({
	selector: 'app-converter-display',
	imports: [DecimalPipe],
	templateUrl: './converter-display.component.html',
	styleUrl: './converter-display.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConverterDisplayComponent {
	store = inject(ConverterStore);
}
