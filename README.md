# Tournament Management

A brief introduction to the Tournament Management project. Describe what the project does, its main features, and any unique selling points or technical details that might interest readers.

## Getting Started

These instructions will guide you through setting up the project on your local machine for development and testing purposes, as well as deploying it for live use.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

These tools are required to build and run the containers for the project.

### Setup

This project utilizes a Makefile to streamline Docker operations such as building images and starting services. The Makefile defines several targets for convenience.

#### Understanding the Makefile

The Makefile contains directives for Docker Compose and sets a default project name to `tournament-management`. It includes the following targets:

- `build`: Builds the Docker images for the project.
- `up`: Launches the containers in detached mode.

### Building the Project

To build Docker images for the project, run the following command from the project's root directory:

```bash
make build
