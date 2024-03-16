import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html'
})
export class CustomSelectComponent implements OnInit{
  @Input() control: FormControl | any;
  @Input() options: any[] = [];
  @Input() submitted: boolean | undefined;
  @Output() change = new EventEmitter<any>();
  @Input() labelSelect: string | undefined;
  selectedOption: any;
  isOpen: any;

  ngOnInit() {
    // Asegúrate de que las opciones estén definidas antes de intentar encontrar una opción
    if (this.options) {
      // Encuentra la opción con el valor '0'
      let option = this.options.find(option => option.value === '0');
      // Si la opción con el valor '0' existe, selecciona esta opción
      if (option) {
        this.selectedOption = option.label;
        this.change.emit(option.value);
      }
    }
  }

  selectOption(option: any) {
    this.selectedOption = option.label;
    this.control.setValue(option.value);
    this.change.emit(option.value);
  }

  onSelectChange(option: any) {
    this.selectOption(option);
  }
}