# Sterma App - Guia de instalación

## REQUISITOS

- Windows, macOS o Linux
- Conexión a Internet
- Al menos 10 GB libres en disco

## BACKEND - Spring Boot Application

Para ejecutar el Backend tenemos varias opciones, podemos ejecutarlo con Docker o ejecutando mediante Java y Maven

Toda la configuración (base de datos, JWT, Cloudinary, CORS, Swagger) se lee de variables de entorno. La lista completa está en `back/.env.example`.

---
### EJECUTAR LA APLICACIÓN EN DOCKER

Para ejecutar la aplicación mediantes Docker necesitaremos tener instalado Docker en nuestro dispositivo (Para windows es necesario tener abierto docker desktop mientras se ejecutan los comandos).
#### PASOS

1. Acceder a la carpeta **back** y abrir una terminar
2. Copiar `.env.example` como `.env` y rellenar los valores (JWT y Cloudinary)
3. Levantar la base de datos PostgreSQL y el backend

```
docker compose up -d --build
```

- La aplicación estará disponible en: http://localhost:8080

4.  Comprobar que la aplicación funciona correctamente entrado al panel de administrado de Swagger (requiere `SWAGGER_ENABLED=true` en `.env`): http://localhost:8080/swagger-ui/index.html#/Auth/login
	* Te puedes autenficiar con las credenciales:
		* Usuario: tecnico4
		* Password: p4ssword

5. Detener y eliminar los contenedores (opcional)

```
docker compose down
```

---
### EJECUTAR LA APLICACIÓN LOCALMENTE CON JAVA 21

Para ejecutar la aplicación con java es necesario tener instalado:
- Java 21 JDK
- Maven 3.9+
#### PASOS

1. Acceder a la carpeta **back** y abrir una terminal en ella
2. Compilar con Maven

```
mvn clean package -DskipTests
```

3. Definir en la terminal las variables de `back/.env.example` (con una base de datos PostgreSQL accesible) y ejecutar la aplicación

```
java -jar target/<nombre-del-jar-generado>.jar
```

4.  Comprobar que la aplicación funciona correctamente entrado al panel de administrado de Swagger (requiere `SWAGGER_ENABLED=true`): http://localhost:8080/swagger-ui/index.html#/
	* Te puedes autenficiar con las credenciales:
		* Usuario: tecnico4
		* Password: p4ssword

---
###  **NOTAS** ⚠️

- Asegúrate de que ningún otro servicio use el puerto 8080 en tu máquina antes de ejecutar la aplicación.

---
## DESPLIEGUE EN RAILWAY

El proyecto se despliega como tres servicios dentro del mismo proyecto de Railway. Ninguna URL está escrita en el código: todas se definen como variables.

| Servicio | Root Directory | Build |
|---|---|---|
| `Postgres` | — | Plantilla PostgreSQL de Railway |
| `back` | `back` | `back/Dockerfile` |
| `admin` | `admin/admin-panel` | `admin/admin-panel/Dockerfile` |

Genera un dominio público (*Settings → Networking → Generate Domain*) para `back` y para `admin`.

### Variables de `back`

| Variable | Valor |
|---|---|
| `PGHOST` | `${{Postgres.PGHOST}}` |
| `PGPORT` | `${{Postgres.PGPORT}}` |
| `PGDATABASE` | `${{Postgres.PGDATABASE}}` |
| `PGUSER` | `${{Postgres.PGUSER}}` |
| `PGPASSWORD` | `${{Postgres.PGPASSWORD}}` |
| `JWT_SECRET` | Secreto aleatorio de al menos 32 caracteres |
| `JWT_EXPIRATION_MS` | p. ej. `86400000` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Credenciales de Cloudinary |
| `CORS_ALLOWED_ORIGINS` | `https://${{admin.RAILWAY_PUBLIC_DOMAIN}}` |

`PORT` lo asigna Railway. Swagger queda desactivado en producción (`SWAGGER_ENABLED` no se define).

### Variables de `admin`

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://${{back.RAILWAY_PUBLIC_DOMAIN}}` |

`VITE_API_URL` se incrusta al compilar: si cambia, hay que volver a desplegar el panel.

---
## FRONTEND 

Para cargar el frontend podemos usar 2 métodos diferentes, cargar la apk en un emulador de android o ejecutar el proyecto de flutter.
## CARGAR APK EN EMULADOR
### DESCARGAR E INSTALAR ANDROID STUDIO

Página oficial:
[Android Studio](https://developer.android.com/studio?utm_source=chatgpt.com)

Pasos:
1. Entra en la página oficial.
2. Pulsa "Download Android Studio".
3. Acepta los términos.
4. Descarga el instalador.
5. Ejecuta el instalador.
6. Instala:
   - Android Studio
   - Android SDK
   - Android Virtual Device (AVD)

Durante la instalación:
- Deja las opciones por defecto.
- Espera a que descargue componentes adicionales.

### CREAR UN EMULADOR EN ANDROID STUDIO

1. Abre Android Studio.
2. En la pantalla principal:
   - Ve a "More Actions"
   - Selecciona "Virtual Device Manager"

3. Pulsa:
   + Create Device

4. Elige un dispositivo:
   Ejemplo:
   - Pixel 6
   - Pixel 7

5. Pulsa "Next".

6. Descarga una imagen del sistema Android:
   Recomendado:
   - Android 13 o Android 14
   - x86_64

7. Pulsa:
   Download

8. Cuando termine:
   - Pulsa "Finish"

9. Inicia el emulador:
   - Pulsa el botón ▶ junto al dispositivo.

El emulador tardará unos minutos la primera vez.

### CARGAR LA APK EN EL EMULADOR

#### MÉTODO 1 (MÁS FÁCIL)

1. Inicia el emulador.
2. Busca el archivo APK. Se encuentra en la carpeta *apk*. 
3. Arrastra el archivo APK dentro de la ventana del emulador.
4. Espera unos segundos.
5. La aplicación se instalará automáticamente.

#### MÉTODO 2 (USANDO ADB)

1. Abre Android Studio.
2. Abre una terminal.
3. Ve a la carpeta donde está la APK (carpeta *apk*)

4. Ejecuta:

```
adb install miapp.apk
```

#### CONSEJOS

- Si el emulador va lento:
  - Aumenta RAM
  - Usa aceleración por hardware

### COMPROBAR QUE LA APP SE INSTALÓ

Dentro del emulador:
- Abre el menú de aplicaciones.
- Busca el icono de tu app.
- Ábrela normalmente.

---
## FLUTTER (EJECUCIÓN DEL PROYECTO)

Además de la opción de instalar la aplicación mediante APK en un emulador, también es posible ejecutar el proyecto de **Flutter** directamente en modo desarrollo.
### REQUISITOS PREVIOS

Antes de ejecutar el proyecto **Flutter**, es necesario disponer de:

- Flutter SDK instalado correctamente
- Android Studio instalado
- Android SDK configurado
- Un emulador Android creado o un dispositivo físico conectado
- Variable de entorno PATH configurada para Flutter

Para comprobar que Flutter está correctamente instalado, se puede ejecutar:

```
flutter doctor
```

Este comando indicará si falta alguna dependencia o configuración.
### EJECUCIÓN DEL PROYECTO

#### PASOS

1. Acceder a la carpeta *front* y abrir una terminal

2. Obtener las dependencias del proyecto

```
flutter pub get
```

3. Verificar dispositivos disponibles y comprobar que tenemos un emulador android

```
flutter devices
```

4. Ejecutar la aplicación

```
flutter run
```