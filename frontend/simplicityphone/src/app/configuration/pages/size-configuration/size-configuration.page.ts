import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Preferences } from 'src/app/models/preferences';
@Component({
  selector: 'app-size-configuration',
  templateUrl: './size-configuration.page.html',
  styleUrls: ['./size-configuration.page.scss'],
})
export class SizeConfigurationPage implements OnInit {
  preferencesForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    private fb: FormBuilder
  ) {
    this.preferencesForm = this.fb.group({
      button_size: [12, Validators.required],
      text_size: [14, Validators.required],
      image_size: [16, Validators.required],
    });
  }

  ngOnInit() {
    this.loadPreferences();
  }

  loadPreferences() {
    this.firebaseService.getPreferences().subscribe((prefs: Preferences) => {
      this.preferencesForm.patchValue({
        button_size: prefs.button_size,
        text_size: prefs.text_size,
        image_size: prefs.image_size,
      });
    });
  }

  savePreferences() {
    if (this.preferencesForm.valid) {
      const preferences: Preferences = this.preferencesForm.value;
      this.firebaseService.updatePreferences(preferences).subscribe({
        next: () => {
          console.log('Preferences updated successfully');
        },
        error: (error) => {
          console.error('Error updating preferences:', error);
        },
        complete: () => {
          console.log('Preferences update complete');
        },
      });
    }
  }
}
