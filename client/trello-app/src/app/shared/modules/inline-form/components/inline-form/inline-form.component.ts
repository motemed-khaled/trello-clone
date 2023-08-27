import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inline-form',
  templateUrl: './inline-form.component.html',
  styleUrls: ['./inline-form.component.scss']
})
export class InlineFormComponent {
  @Input() title: string;
  @Input() defaultText: string;
  @Input() hasButton: boolean;
  @Input() buttonText: string;
  @Input() inputPlaceholder: string;
  @Input() inputType: string;

  @Output() handleSubmit = new EventEmitter<string>();

  isEditing: boolean;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.title = "";
    this.defaultText = "Not defined";
    this.hasButton = false;
    this.buttonText = "Submit";
    this.inputPlaceholder = "";
    this.inputType = "input";
    this.isEditing = false;
    this.form = this.fb.group({
      title:[""]
    })
  }

  activateEditing(): void{
    if (this.title) {
      this.form.patchValue({title:this.title})
    }
    this.isEditing=true
  }

  onSubmit(): void{
    if (this.form.value.title) {
      this.handleSubmit.emit(this.form.value.title)
    }
    this.isEditing = false;
    this.form.reset();
  }
}
