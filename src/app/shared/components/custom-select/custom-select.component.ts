import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html'
})
export class CustomSelectComponent {
  @Input() control: FormControl | any;
  @Input() options: any[] = [];
  @Input() submitted: boolean | undefined;
  @Output() change = new EventEmitter<any>();
  @Input() labelSelect: string | undefined;
  selectedOption: any;
  isOpen: any;

  selectOption(option: any) {
    this.selectedOption = option.label;
    this.control.setValue(option.value);
    this.change.emit(option.value);
  }

  onSelectChange(option: any) {
    this.selectOption(option);
  }
}