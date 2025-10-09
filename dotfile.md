# Applications

| App                     | Install Command / Source              |
|-------------------------|---------------------------------------|
| **WhatsApp**            | `io.github.mimbrero.WhatsAppDesktop`  |
| **Telegram**            | `org.telegram.desktop`                |
| **Discord**             | *official website*                    |
| **STM32CubeIDE**        | *official website*                    |
| **STM32CubeMX**         | *official website*                    |
| **VS Code**             | `sudo apt install code`               |
| **Windsurf**            | *official website*                    |
| **Vysor**               | *easy*                                |
| **Media Player**        | `smplayer`                            |
| **Neovim**              | `sudo apt install nvim`               |
| **Bottles**             |                                       |
| **AnyDesk**             |                                       |
| **OnlyOffice**          | `apt`                                 |
| **GIMP**                | `org.gimp.GIMP`                       |
| **OBS Studio**          |                                       |
| **Foxit Reader**        |                                       |
| **Serial Port Terminal**|                                       |
| **PuTTY**               |                                       |
| **Tilix**               | `sudo apt insall tilix`               |
| **zsh**                 | `sudo apt install zsh`                |
| **CLangd**              | `sudo apt inatall clangd`             |
| **Git**                 | `sudo apt install git`                |
| **FireFox**             | `firefox from apt`                    |
| **gcc**                 | `sudo apt install gcc`                |
| **clang-format**        | `sudo apt install clang-format`       |
| **FDM**                 | `sudo apt install fdm`                |
| **fzf**                 |  `git clone --depth 1 <https://github.com/junegunn/fzf.git> ~/.fzf` && `~/.fzf/install` |
| **Gnome SW Plugin**     | `sudo apt install gnome-software-plugin-snap` |

---

# Extensions

| Extension                 |                         |
|---------------------------|-------------------------|
| Blur My Shell             |                         |
| Burn My Windows           |                         |
| Clipboard Indicator       |                         |
| Compiz Windows Effect     |                         |
| Dash to Dock              |                         |
| Dash to Pnanel            |                         |
| Desktop Widget (Clock)    |                         |
| GSConnect                 |                         |
| Just Perfection           |                         |
| Lock Screen Background    |                         |
| Vitals                    |                         |
| Apps Menu                 |                         |
| Auto Move Windows         |                         |
| System Monitor            |                         |
| Ubuntu AppIndicator       |                         |
| Ubuntu Tiling Assistant   |                         |

---

# Customization

## Appearance

| Setting              | Value                 |
|----------------------|-----------------------|
| Mouse Cursor         | Bibata-modern-ice     |
| Icons                | Yaru                  |
| Legacy Applications  | Yaru-dark             |

## Font

| Setting        | Value          |
| -------------- | -------------- |
| Interface Text | PoetsenOne     |
| Document Text  | PoetsenOne     |
| Monospace Text | Fira Code Bold |
>**Note:** Some configurations in Neovim, especially icons, may not work properly **unless the monospace font is set to _Fira Code Bold_**

## Default Program

| File Type | Program |
|-----------|---------|
| PDF       | Foxit Reader      |
| Video     | Smplayer          |
| Terminal  | Tilix             |
| Bash      | Zsh               |
| Editor    | nvim              |
| Browser   | Firefox           |

---
# Settings

## Tweaks
  
| Header                | Select       |
|-----------------------|--------------|
| Keyboard Layout       | English (US, euro on 5) |

---

# How to Auto-Mount a Partition on Linux Startup

Here's how to automatically mount your partitions every time you start your system by editing the `fstab` file.

### ## 1. Find the Partition's UUID and Type

First, you need to get the unique identifier (**UUID**) and the filesystem type for the partition you want to mount. Use the `blkid` command with `sudo`:

```bash
sudo blkid
```

This will give you an output listing all partitions, their **UUIDs**, and their **TYPE** (e.g., `ntfs`, `ext4`).
### ## 2. Edit the `/etc/fstab` File

Next, open the filesystem table file, `fstab`, using a text editor with root privileges.
```bash
sudo nvim /etc/fstab
```
### ## 3. Add the Mount Entry

Add a new line at the end of the file using the following format. Each field must be separated by a space or a tab.
```
UUID=<your_partition_uuid> <your_mount_point> <filesystem_type> <options> <dump> <pass>
```

**Example for NTFS Partitions:**

The following examples are for mounting NTFS partitions (like Windows drives) and giving your user ownership to avoid permission issues.
```bash
# Mount Local_Disk
UUID=7C9EBC0D9EBBBE48 /media/abdallah-shehawey/Local_Disk ntfs-3g defaults,nofail,x-gvfs-show,uid=1000,gid=1000,umask=0022 0 0

# Mount WinOS
UUID=01DC06CA66C0E3F0 /media/abdallah-shehawey/WinOS ntfs-3g defaults,nofail,x-gvfs-show,uid=1000,gid=1000,umask=0022 0 0

# Mount Local_Disk2
UUID=01DC06CA66E4E6B0 /media/abdallah-shehawey/Local_Disk2 ntfs-3g defaults,nofail,x-gvfs-show,uid=1000,gid=1000,umask=0022 0 0
```
After saving and closing the file, the partitions will mount automatically on the next reboot.