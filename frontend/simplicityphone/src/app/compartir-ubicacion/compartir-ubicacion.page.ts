import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-compartir-ubicacion',
  templateUrl: './compartir-ubicacion.page.html',
  styleUrls: ['./compartir-ubicacion.page.scss'],
})
export class CompartirUbicacionPage implements OnInit {
    private backendUrl = 'http://localhost:8000/api/v1/location'; // O la URL pública de ngrok
    private watchId!: Promise<string>; // Promesa que resuelve con un identificador de cadena
    private alertShown: boolean = false; // Variable para controlar la alerta
  
    constructor(
      private http: HttpClient,
      private alertController: AlertController,
      private authService: AuthService
    ) {}
  
    ngOnInit() {
      this.checkPermissions();
    }
  
    async checkPermissions() {
      try {
        const position = await Geolocation.getCurrentPosition();
        console.log('Permiso de ubicación concedido', position);
      } catch (error) {
        console.log('Permiso de ubicación denegado', error);
      }
    }
  
    async startTracking() {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
  
      this.watchId = Geolocation.watchPosition(options, (position, err) => {
        if (position) {
          const { latitude, longitude } = position.coords;
          console.log('Latitud: ' + latitude + ' Longitud: ' + longitude);
          this.sendLocationToServer(latitude, longitude);
          this.compareLocation(latitude, longitude);
        } else {
          console.log('Error al obtener la ubicación', err);
        }
      });
    }
  
    async stopTracking() {
      const id = await this.watchId;
      Geolocation.clearWatch({ id });
      console.log('Seguimiento detenido');
    }
  
    sendLocationToServer(lat: number, lng: number) {
      const user = this.authService.getCurrentUser();
      if (user) {
        const userId = user.uid; // Obtén el ID de usuario de Firebase
        const payload = {
          user_id: userId,
          latitude: lat,
          longitude: lng
        };
  
        this.http.post(this.backendUrl, payload)
          .subscribe({
            next: (response) => {
              console.log('Ubicación enviada al servidor', response);
              if (!this.alertShown) {
                this.showConfirmationAlert(lat, lng); // Llamar a showConfirmationAlert solo una vez
                this.alertShown = true;
              }
            },
            error: (error) => {
              console.error('Error al enviar la ubicación', error);
            }
          });
      } else {
        console.error('Usuario no autenticado');
      }
    }
  
    async showConfirmationAlert(lat: number, lng: number) {
      const alert = await this.alertController.create({
        header: 'Confirmar',
        message: '¿Estás seguro de que quieres compartir tu ubicación en tiempo real?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Acción cancelada');
            }
          }, {
            text: 'Compartir',
            handler: () => {
              this.sendLocationToWhatsApp(lat, lng);
            }
          }
        ]
      });
  
      await alert.present();
    }
  
    sendLocationToWhatsApp(lat: number, lng: number) {
      const locationUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      const message = `Sigue mi ubicación en tiempo real aquí: ${locationUrl}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      console.log('Enlace de WhatsApp:', whatsappUrl); // Agregar un log para verificar el enlace
      window.open(whatsappUrl, '_blank');
    }
  
    compareLocation(lat: number, lng: number) {
      console.log(`Comparando ubicación en Google Maps: https://www.google.com/maps?q=${lat},${lng}`);
    }
}
   
