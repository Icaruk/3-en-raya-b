

# Índice <!-- omit in toc -->

- [3 en raya](#3-en-raya)
- [Descripción 📃](#descripción-)
- [Instalación ⚙️](#instalación-️)
- [Repositorios 📦](#repositorios-)
	- [Front 🎨](#front-)
	- [Back 💻](#back-)
- [Cómo lanzar la aplicación 🚀](#cómo-lanzar-la-aplicación-)
- [Features ✨](#features-)
	- [Multiusuario](#multiusuario)
	- [Turno inicial aleatorio](#turno-inicial-aleatorio)
	- [Partidas reanudables](#partidas-reanudables)
	- [IA](#ia)
	- [Reiniciable](#reiniciable)
	- [Ranking](#ranking)



# 3 en raya

![](https://i.gyazo.com/0e65ed6980aa63fe524dda97b08e34e3.png)


# Descripción 📃

El juego consiste en un tablero de 3x3 en el cual **dos jugadores** colocan fichas en los espacios vacíos.
Quien consiga tener **3 fichas consecutivas** en horizontal, vertical o diagonal, gana.
Si el tablero se llena sin ningun ganador, es un empate.



# Instalación ⚙️

Sólo hay que lanzar el comando `npm i` en ambos repositorios:

- 3-en-raya-b
- 3-en-raya-f


#  Repositorios 📦

## Front 🎨

https://github.com/Icaruk/3-en-raya-f

**Tecnologías**:

- react (con [vite](https://vitejs.dev) en lugar de CRA)
- [mantine](https://mantine.dev) para la UI
- [dame](https://www.npmjs.com/package/dame) como cliente HTTP (en lugar de axios)
- [react router](https://reactrouter.com)

**Comandos**:

- `npm dev`
- `npm build`



## Back 💻

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



# Cómo lanzar la aplicación 🚀

*(Los archivos de entorno están pusheados para facilidad de la review, el usuario de mongo tiene acceso limitado)*

- En el front: `npm run dev`
- En el back: `npm run start`

El front estará en http://localhost:3000
El back estará en http://localhost:3100


# Features ✨

## Multiusuario
El jugador elige su username al empezar la partida.

![](https://i.gyazo.com/ee9bb4d6b19962346bf846449ce5fd29.png)

## Turno inicial aleatorio
El inicio del turno será aleatorio, si empieza la IA siempre colocará su ficha en el centro.

## Partidas reanudables
Mientras no se pierda la URL de la partida, da igual si se refresca la página.

## IA
Tendrá las siguientes prioridades en sus jugadas:

1. Colocar ficha en una posición que gane la partida para la IA.
2. Colocar ficha en una posición que gane la partida para el jugador humano, para bloquearle.
3. Jugar aleatoriamente en una posición vacía.

_Lamentablemente, la IA no intenta hacer la jugada del "triángulo de la muerte"_
⬜⬜⬜
⬜❌⬜
❌⬜❌

![](https://i.gyazo.com/3e365198537f9e1e2459fb67b93cd96d.png)

## Reiniciable

😭 ¿Quieres hacer trampas? ¿Estás perdiendo? Pulsa sobre el botón "Reset" y empieza de nuevo la partida.
Como si no hubiera pasado nada 🪄.

## Ranking

Se listará el top 10 de jugadores con más victorias.

![](https://i.gyazo.com/45fd5a9bf54b0be6ee76358eef3b2805.png)