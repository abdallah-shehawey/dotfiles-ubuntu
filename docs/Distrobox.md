# Fedora + Distrobox + Arch + AUR Setup Guide

This guide explains how to:

- Install Distrobox on Fedora
    
- Create an Arch Linux container
    
- Enable NVIDIA GPU support
    
- Install and use AUR inside Arch
    
- Export GUI applications back to Fedora
    
- Troubleshoot common errors
    

---

## 1) Install Distrobox on Fedora

```bash
sudo dnf install distrobox
```

Install Podman if not already installed:

```bash
sudo dnf install podman
```

Verify installation:

```bash
distrobox --version
```

---

## 2) Create an Arch Linux Container

Create the container (recommended lowercase name):

```bash
distrobox create --name arch --image archlinux:latest
```

If you want NVIDIA GPU support (recommended for CUDA, AI, Gaming, or GPU rendering), create the container with explicit NVIDIA integration:

```bash
distrobox create \
  --name arch \
  --image archlinux:latest \
  --nvidia
```

What `--nvidia` does:

- Mounts NVIDIA device files into the container
    
- Shares host NVIDIA driver libraries
    
- Enables CUDA / OpenGL / Vulkan acceleration inside Arch
    

⚠️ Requirements before using `--nvidia`:

1. NVIDIA drivers must be correctly installed on Fedora (host).
    
2. `nvidia-smi` must work on the host system.
    
3. You must NOT use `sudo distrobox create` (rootless is recommended).
    

Verify host GPU before creating container:

```bash
nvidia-smi
```

If this works on Fedora, GPU will work inside the container.

Enter the container:

```bash
distrobox enter arch
```

---

## 3) First Time Arch Setup

Update system:

```bash
sudo pacman -Syu
```

Install build tools required for AUR:

```bash
sudo pacman -S base-devel git
```

---

## 4) Install yay (AUR Helper)

```bash
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

Test installation:

```bash
yay -S google-chrome
```

---

## 5) Installing WhatsApp from AUR (Example)

Search for correct package name:

```bash
yay -S whatsapp-for-linux
```

If prompted for clean build:

- Choose `A` for clean build
    
- Press `q` to exit diff view
    
- Confirm with `Y`
    

Launch application:

```bash
whatsapp-for-linux
```

---

## 6) Export Arch Apps to Fedora

To make an installed Arch application available in Fedora menu:

```bash
distrobox-export --app whatsapp-for-linux
```

---

## 7) NVIDIA GPU Usage Inside Container

Ensure NVIDIA driver works on Fedora host:

```bash
nvidia-smi
```

Inside Arch install utilities:

```bash
sudo pacman -S nvidia-utils
```

Test GPU:

```bash
nvidia-smi
```

For hybrid GPU systems (Optimus), force NVIDIA usage:

```bash
__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia program-name
```

---

## 8) Common Mistakes & Troubleshooting

### Mistake: Deleting ~/.cache During Setup

Do NOT run:

```bash
rm -rf ~/.cache
```

Distrobox stores required files in:

```
~/.cache/distrobox/
```

If broken:

```bash
distrobox rm arch
rm -rf ~/.cache/distrobox
```

Then recreate container.

---

### Error: "crun: ptsname: Inappropriate ioctl for device"

Possible causes:

- Interrupted container setup
    
- Terminal session issue
    

Fix:

```bash
podman system reset
```

Or simply reboot / logout-login.

---

## 9) Remove the Container

```bash
distrobox rm arch
```

---

## Key Notes

- Arch inside Distrobox does NOT affect Fedora
    
- Home directory is shared
    
- GPU, sound, themes are integrated
    
- You can safely experiment with AUR
    

---

End of Guide.