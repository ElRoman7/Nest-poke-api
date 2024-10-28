<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Project setup

```bash
$ yarn install
```

## Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```
$ yarn install
```

3. Tener el cli instalado

```
$ npm i -g @nest/cli
```

4. Levantar la Base de Datos (Usando Docker)

```
$ docker-composer up -d
```

5. Clonar el archivo **.env_template** y renombrar la copia a **env**

6. Llenar las variables de entorno definidas en el **.env**

7. Correr el Proyecto en Modo de Desarrollo

```
$ yarn start:dev
```

8. Reconstruir Base de datos con el seed

```
$ http://localhost:3000/api/v2/seed
```

## Stack Usado

- MongoDB
- Nest
- Angular

## Autor

Desarrollado por [Sergio Roman](https://github.com/ElRoman7).  
Contacto: sergio.romam@outlook.com
