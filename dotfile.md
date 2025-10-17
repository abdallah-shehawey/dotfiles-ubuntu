# My Linux Setup & Configuration

This document is my personal guide for all the settings, software, and customizations I use on my Linux system.

## Software Installation

A list of the essential software I use, along with their installation commands or sources.

|Application|Install Command / Source|Notes|
|---|---|---|
|**WhatsApp**|`flatpak install flathub io.github.mimbrero.WhatsAppDesktop`|Unofficial Flatpak version|
|**Telegram**|`flatpak install flathub org.telegram.desktop`|Official Version|
|**Discord**|Official Website (`.deb`)||
|**STM32CubeIDE**|Official Website|IDE for STM32 development|
|**STM32CubeMX**|Official Website|Code generation tool|
|**VS Code**|`sudo apt install code`|Code Editor|
|**Windscribe**|Official Website (`.deb`)|VPN Service (Corrected from Windsurf)|
|**Vysor**|Official Website|Mirror phone screen to computer|
|**SMPlayer**|`sudo apt install smplayer`|Media Player|
|**Neovim**|`sudo apt install neovim`|Advanced Text Editor|
|**Bottles**|`flatpak install flathub com.usebottles.bottles`|Run Windows software|
|**AnyDesk**|Official Website (`.deb`)|Remote Desktop Access|
|**OnlyOffice**|`sudo apt install onlyoffice-desktopeditors`|Office Suite|
|**GIMP**|`flatpak install flathub org.gimp.GIMP`|Image Editor|
|**OBS Studio**|`sudo apt install obs-studio`|Recording & Streaming|
|**Foxit Reader**|Official Website (`.deb`)|PDF Reader|
|**Serial Port Terminal**|`sudo apt install cutecom`|GUI for serial devices|
|**PuTTY**|`sudo apt install putty`|SSH and Telnet client|
|**Tilix**|`sudo apt install tilix`|Tiling Terminal Emulator|
|**zsh**|`sudo apt install zsh`|Alternative Shell|
|**clangd**|`sudo apt install clangd`|Language server for C/C++|
|**Git**|`sudo apt install git`|Version Control System|
|**Firefox**|`sudo apt install firefox`|Web Browser|
|**gcc**|`sudo apt install gcc`|C Compiler|
|**clang-format**|`sudo apt install clang-format`|Code Formatter|
|**FDM**|Official Website (`.deb`)|Free Download Manager|
|**fzf**|`git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf && ~/.fzf/install`|Command-line fuzzy finder|
|**Gnome SW Plugin**|`sudo apt install gnome-software-plugin-snap`|Snap plugin for GNOME Software|

---
## GNOME Extensions

A list of extensions I use to enhance the GNOME desktop experience.

| Extension                   | Purpose                                                    |
| --------------------------- | ---------------------------------------------------------- |
| **Blur My Shell**           | Applies a blur effect to the shell overview and top panel. |
| **Burn My Windows**         | Adds destructive window-closing effects.                   |
| **Clipboard Indicator**     | A simple and powerful clipboard manager.                   |
| **Compiz Windows Effect**   | Adds wobbly window effects like Compiz.                    |
| **Dash to Dock**            | Transforms the dash into a configurable dock.              |
| **Dash to Panel**           | Combines the dash and top panel into a single panel.       |
| **Desktop Widget (Clock)**  | Adds a clock widget to the desktop.                        |
| **GSConnect**               | Integrates your phone with the GNOME desktop.              |
| **Just Perfection**         | A comprehensive tool to customize the GNOME Shell.         |
| **Lock Screen Background**  | Sets a custom background for the lock screen.              |
| **Vitals**                  | Displays system temperature, voltage, fan speed, etc.      |
| **Apps Menu**               | Adds a traditional application menu.                       |
| **Auto Move Windows**       | Automatically moves applications to specific workspaces.   |
| **System Monitor**          | Displays system resource usage in the top panel.           |
| **Ubuntu AppIndicator**     | Supports application indicators in the top panel.          |
| **Ubuntu Tiling Assistant** | Enhances window tiling functionality.                      |

---
## Customization

### Appearance

|Setting|Value|
|---|---|
|**Mouse Cursor**|Bibata-modern-ice|
|**Icons**|Yaru|
|**Legacy Applications**|Yaru-dark|

### Fonts

| Setting            | Value          |     |
| ------------------ | -------------- | --- |
| **Interface Text** | PoetsenOne     |     |
| **Document Text**  | PoetsenOne     |     |
| **Monospace Text** | Fira Code Bold |     |

> **Note:** Some configurations in Neovim, especially icons, may not work properly **unless the monospace font is set to** _**Fira Code Bold**_.

### Default Applications

|File Type|Program|
|---|---|
|**PDF**|Foxit Reader|
|**Video**|SMPlayer|
|**Terminal**|Tilix|
|**Shell**|Zsh|
|**Editor**|nvim|
|**Browser**|Firefox|

## System Tweaks

|Area|Setting|Value|
|---|---|---|
|**Keyboard**|Layout|English (US, euro on 5)|

---
## How to Auto-Mount Partitions on Linux Startup

Here's how to automatically mount your partitions every time you start your system by editing the `fstab` file.

### Step 1: Find the Partition's UUID and Type

First, get the unique identifier (**UUID**) and filesystem type for the partition.

```bash
sudo blkid
```

This will list all partitions, their **UUIDs**, and their **TYPE** (e.g., `ntfs`, `ext4`).

### Step 2: Edit the `/etc/fstab` File

Open the filesystem table file (`fstab`) with root privileges.

```bash
sudo nvim /etc/fstab
```

### Step 3: Add the Mount Entry

Add a new line at the end of the file using this format (separate fields with a space or tab): `UUID=<your_partition_uuid> <your_mount_point> <filesystem_type> <options> <dump> <pass>`

**Example for NTFS Partitions:** These examples mount NTFS partitions and grant user ownership to prevent permission issues.

```bash
# Mount Local_Disk
UUID=7C9EBC0D9EBBBE48 /media/abdallah-shehawey/Local_Disk ntfs-3g defaults,nofail,x-gvfs-show,uid=1000,gid=1000,umask=0022 0 0

# Mount WinOS
UUID=01DC06CA66C0E3F0 /media/abdallah-shehawey/WinOS ntfs-3g defaults,nofail,x-gvfs-show,uid=1000,gid=1000,umask=0022 0 0

# Mount Local_Disk2
UUID=01DC06CA66E4E6B0 /media/abdallah-shehawey/Local_Disk2 ntfs-3g defaults,nofail,x-gvfs-show,uid=1000,gid=1000,umask=0022 0 0
```

After saving, the partitions will mount automatically on the next reboot.

---
## Guide to Customizing GRUB and Improving Boot Time

This guide covers changing the GRUB theme, customizing the menu, and speeding up your system's boot process.

### Part 1: Installing a New GRUB Theme

#### Step 1: Download the Theme

Find themes on websites like [**GNOME-Look.org**](https://www.gnome-look.org/browse?cat=109 "null").

#### Step 2: Extract and Move the Theme Files

1. **Extract the downloaded file** (e.g., `.tar.gz`).
    
    ```
    tar -xvf theme-file.tar.gz
    ```
    
2. **Copy the theme folder to the GRUB paths.**
    
    ```
    # Use sudo for protected directories
    sudo cp -r theme-folder-name /boot/grub/themes/
    sudo cp -r theme-folder-name /usr/share/grub/themes/
    ```
    

#### Step 3: Modify the GRUB Configuration File

1. **Open the `grub` configuration file.**
    
    ```
    sudo nvim /etc/default/grub
    ```
    
2. **Add or modify the `GRUB_THEME` line.**
    
    ```
    # Replace with the correct path to your theme's theme.txt
    GRUB_THEME="/usr/share/grub/themes/theme-folder-name/theme.txt"
    ```
    
#### Step 4: Update GRUB to Apply

```bash
sudo update-grub
```

---
## Removing Menu Entries (Memory Test & UEFI Settings)

To simplify the GRUB menu, remove execute permissions from the corresponding scripts.

```bash
# Remove the Memory Test option
sudo chmod -x /etc/grub.d/20_memtest86+

# Remove the UEFI Firmware Settings option
sudo chmod -x /etc/grub.d/30_uefi-firmware
```

#### then Update GRUB to Apply

```bash
sudo update-grub
```

---
## Speeding Up Boot Time

Disable the service that waits for the network to be configured on startup.

1. **Disable and mask the service:**
    
    ```bash
    sudo systemctl disable NetworkManager-wait-online.service
    sudo systemctl mask NetworkManager-wait-online.service
    ```
    
2. **To re-enable it in the future:**
    
    ```bash
    sudo systemctl unmask NetworkManager-wait-online.service
    sudo systemctl enable NetworkManager-wait-online.service
    ```
    

#### How to Analyze Boot Time

1. **Get the total boot time:**
    
    ```bash
    systemd-analyze
    ```
    
2. **List services by initialization time:**
    
    ```bash
    systemd-analyze blame | head -n 20
    ```

---