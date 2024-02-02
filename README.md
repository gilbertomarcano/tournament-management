# Gestión de Torneos

Una breve introducción al proyecto de Gestión de Torneos. Describe qué hace el proyecto, sus principales características y cualquier punto de venta único o detalles técnicos que puedan interesar a los lectores.

## Primeros pasos

Estas instrucciones te guiarán para configurar el proyecto en tu máquina local con fines de desarrollo y pruebas, así como para desplegarlo para uso en vivo.

### Prerrequisitos

Antes de comenzar, asegúrate de tener lo siguiente instalado en tu sistema:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

Estas herramientas son necesarias para construir y ejecutar los contenedores del proyecto.

### Configuración

Este proyecto utiliza un Makefile para simplificar las operaciones de Docker, como construir imágenes e iniciar servicios. El Makefile define varios objetivos para conveniencia.

#### Entendiendo el Makefile

El Makefile contiene directivas para Docker Compose y establece un nombre de proyecto predeterminado como `tournament-management`. Incluye los siguientes objetivos:

- `build`: Construye las imágenes Docker para el proyecto.
- `up`: Lanza los contenedores en modo detached.

### Construyendo el Proyecto

Para construir las imágenes Docker para el proyecto, ejecuta el siguiente comando desde el directorio raíz del proyecto:

```bash
make build
