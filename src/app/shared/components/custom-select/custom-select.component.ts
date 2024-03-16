import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef } from '@angular/core';
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

  constructor(private eRef: ElementRef) { }

  ngOnInit() {
    if (this.options) {
      let option = this.options.find(option => option.value === '0');
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

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}