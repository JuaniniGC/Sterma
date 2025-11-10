# Sterma App


REQUISITOS PREVIOS

- Java 21 JDK
- Maven 3.9+
- Docker (opcional si deseas usar contenedor)
- Docker Compose (opcional)


## Back - Spring Boot Application

---

1. EJECUTAR LA APLICACIÓN EN DOCKER

Paso 1: Construir la imagen
docker build -t sterma-back .

Paso 2: Ejecutar el contenedor
docker run -d -p 8080:8080 --name sterma-back-app sterma-back

- La aplicación estará disponible en: http://localhost:8080

Paso 3: Verificar logs (opcional)
docker logs -f sterma-back-app

Paso 4: Detener y eliminar contenedor (opcional)
docker stop sterma-back-app
docker rm sterma-back-app

---

2. EJECUTAR LA APLICACIÓN LOCALMENTE CON JAVA 21

Paso 1: Compilar con Maven
mvn clean package -DskipTests

Paso 2: Ejecutar la aplicación
java -jar target/<nombre-del-jar-generado>.jar

- Por defecto Spring Boot escucha en el puerto 8080.
- Accede a la aplicación en: http://localhost:8080

---

NOTAS

- Asegúrate de que ningún otro servicio use el puerto 8080 en tu máquina antes de ejecutar la aplicación.
- Para cambiar el puerto de Spring Boot, edita application.properties:
  server.port=8080
  server.address=0.0.0.0

- server.address=0.0.0.0 es importante para que la aplicación sea accesible desde fuera del contenedor Docker.
