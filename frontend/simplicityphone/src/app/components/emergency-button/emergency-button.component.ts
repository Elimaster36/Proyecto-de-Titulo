import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-emergency-button',
  templateUrl: './emergency-button.component.html',
  styleUrls: ['./emergency-button.component.scss'],
})
export class EmergencyButtonComponent implements OnInit {
  @Input() service!: string;
  @Input() icon!: string; // Para la imagen de assets
  @Input() ionIcon!: string; // Para el icono de Ionic
  @Input() buttonColor!: string; // Color del botón
  @Input() customColor!: string; // Color personalizado para casos especiales
  @Input() customClass!: string; // Clase personalizada para estilos adicionales

  constructor() {}

  ngOnInit() {}

  callEmergencyService() {
    let phoneNumber: string;

    switch (this.service) {
      case 'bomberos':
        phoneNumber = '132';
        break;
      case 'carabineros':
        phoneNumber = '133';
        break;
      case 'ambulancia':
        phoneNumber = '131';
        break;
      default:
        phoneNumber = '';
    }

    window.open(`tel:${phoneNumber}`, '_system');
  }
}

