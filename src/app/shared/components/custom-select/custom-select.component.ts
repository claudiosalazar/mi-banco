import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html'
})
export class CustomSelectComponent implements OnInit {
  @Input() errorKey: any;
  @Input() control: FormControl | any;
  @Input() options: any[] = [];
  @Input() submitted: boolean | undefined;
  @Output() change = new EventEmitter<any>();
  @Input() labelSelect: string | undefined;
  @Input() zIndex: number | undefined;
  @Input() selectedValue: any;
  private _selectedOption: any;
  private _isOpen = false;

  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value === true) {
      setTimeout(() => {
        const optionsList = this.el.nativeElement.querySelectorAll('.options');
        if (optionsList) {
          optionsList.forEach((options: { style: { zIndex: string; }; }, index: number) => {
            options.style.zIndex = ((this.zIndex || 0) - index * 100).toString();
          });
        } else {
        }
      });
    }
  }

  get isOpen() {
    return this._isOpen;
  }

  constructor(
    private eRef: ElementRef,
    private el: ElementRef
  ) { }

  get selectedOption(): any {
    return this.selectedValue || this._selectedOption;
  }
  set selectedOption(value: any) {
    this._selectedOption = value;
  }

  ngOnInit() {
    const label = this.el.nativeElement.querySelector('.label');

    if (label) {
      label.style.zIndex = ((this.zIndex || 0) + 10).toString();
    }

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
    if (this.control) {
      this.control.setValue(option.value);
    }
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
