# Football Tournament Management.

Brief description.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them.

- Python 3.12.1 or later
- Access to command line interface (CLI) - Terminal on macOS/Linux and Command Prompt/PowerShell on Windows.

### Setting Up a Virtual Environment

A virtual environment is an isolated Python environment that allows you to manage project-specific dependencies separately from other projects. Here's how you can set one up:

#### On Windows

1. **Create the Virtual Environment:**
   - Open Command Prompt or PowerShell.
   - Navigate to your project's directory:
     ```cmd
     cd path/to/tournament-management/server
     ```
   - Create the virtual environment:
     ```cmd
     python -m venv env
     ```
     Replace `env` with your desired environment name.

2. **Activate the Virtual Environment:**
   - In Command Prompt:
     ```cmd
     .\env\Scripts\activate
     ```
   - In PowerShell:
     ```powershell
     .\env\Scripts\Activate.ps1
     ```
   - If you encounter permissions errors in PowerShell, you might need to adjust the execution policy:
     ```powershell
     Set-ExecutionPolicy Unrestricted -Scope Process
     ```
     Then, try activating the environment again.

#### On macOS (and Linux)

1. **Create the Virtual Environment:**
   - Open Terminal.
   - Navigate to your project's directory:
     ```bash
     cd path/to/tournament-management/server
     ```
   - Create the virtual environment:
     ```bash
     python3 -m venv env
     ```
     Replace `env` with your desired environment name.

2. **Activate the Virtual Environment:**
   - In Terminal:
     ```bash
     source env/bin/activate
     ```

### Deactivating the Virtual Environment

To deactivate the virtual environment and return to your global Python setup, simply run:

```bash
deactivate
