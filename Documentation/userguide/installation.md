# Installation

This guide explains how to install the **Bolt** on a Windows system.

## 1. System Requirements

Before installing, ensure your system meets the following requirements:

- Windows 10 or 11 (64-bit)
- TwinCAT 3 installed
- Administrative privileges (required for service installation)
- .NET Framework 4.8 or later


## 2. Download the Installer

1. Open your web browser and navigate to the release page:  
   [https://github.com/Zeugwerk/Bolt-Release/releases/latest](https://github.com/Zeugwerk/Bolt-Release/releases/latest)
2. Download the latest installer `.exe` file.

> [!NOTE]
> Keep note of the folder where you download the installer.


## 3. Run the Installer

1. Right-click the downloaded installer and select **Run as administrator**.
   > Administrative privileges are required to install the Windows service and register the TwinCAT library.
2. Follow the on-screen instructions:

   - **Installation Path:** Choose the folder where the service and library will be installed.
   - **Components:** The installer will automatically install:
     - **Bolt Windows Service**
     - **Bolt TwinCAT Library**

3. Click **Install** to start the installation process.

## 4. Verify Windows Service Installation

After installation, the Bolt service should be registered as a Windows service.

1. Press `Win + R`, type `services.msc`, and press Enter.
2. Look for **Bolt Service** in the list.
3. Ensure the service is running:
   - Status should be **Running**
   - Startup type should be **Automatic**

> [!NOTE]
> If the service is not running, right-click it and select **Start**.


## 5. Verify TwinCAT Library Installation

1. Open **TwinCAT XAE**.
2. In your project, go to **References → Add Library...**
3. Look for **Bolt** in the list.
4. Add it to your project to ensure it is correctly installed.

> [!NOTE]
> The Bolt TwinCAT Library can also easily be added using [Twinpack](https://github.com/Zeugwerk/Twinpack)


## 6. Uninstallation

To uninstall the service and library:

1. Open **Control Panel → Programs and Features**
2. Select **Bolt** and click **Uninstall**


## 7. Support

For issues or questions, please open an issue on the GitHub repository:  
[https://github.com/Zeugwerk/Bolt-Release/issues](https://github.com/Zeugwerk/Bolt-Release/issues)

