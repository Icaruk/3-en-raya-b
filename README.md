
- [3 en raya](#3-en-raya)
- [Descripción](#descripción)
- [Instalación](#instalación)
- [Repositorios](#repositorios)
	- [Front](#front)
	- [Back](#back)
- [Cómo lanzar la aplicación](#cómo-lanzar-la-aplicación)



# 3 en raya

![](https://i.gyazo.com/0e65ed6980aa63fe524dda97b08e34e3.png)


# Descripción

El juego consiste en un tablero de 3x3 en el cual **dos jugadores** colocan fichas.
Quien consiga tener **3 fichas consecutivas** en horizontal, vertical o diagonal, gana.
Si el tablero se llena sin ningun ganador, es un empate.



# Instalación

Sólo hay que lanzar el comando `npm i` en ambos repositorios:

- 3-en-raya-b
- 3-en-raya-f


#  Repositorios

## Front

https://github.com/Icaruk/3-en-raya-f

**Tecnologías**:

- react (con [vite](https://vitejs.dev) en lugar de CRA)
- [mantine](https://mantine.dev) para la UI
- [dame](https://www.npmjs.com/package/dame) como cliente HTTP (en lugar de axios)
- [react router](https://reactrouter.com)

**Comandos**:

- `npm dev`
- `npm build`



## Back

https://github.com/Icaruk/3-en-raya-b

**Tecnologías**:

- [fastify](https://www.fastify.io) (en lugar de express)
- [entor](https://www.npmjs.com/package/entor) (en lugar de dotenv)
- mongodb
- jest

**Comandos**:

- `npm start` (apunta a producción)
- `npm run start:mon` (apunta a producción con nodemon)
- `npm run start:local` (apunta a local con nodemon)
- `npm run jest` (para ejecutar los tests)



# Cómo lanzar la aplicación

*(Los archivos de entorno están pusheados para facilidad de la review, el usuario de mongo tiene acceso limitado)*

- En el front: `npm run dev`
- En el back: `npm run start`

El front estará en http://localhost:3000
El back estará en http://localhost:3100

