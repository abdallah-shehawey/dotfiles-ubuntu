# Enabling Hibernate on Linux (Debian-based & Fedora)

## Overview

Hibernate saves the entire RAM state to disk and powers off the machine. When you power it back on, the system restores exactly where you left off.

For Hibernate to work properly:

- Swap must exist
    
- Swap size should be >= RAM
    
- The kernel must know where the swap is
    

---

# Debian-based Distributions

Examples: Ubuntu, Linux Mint, Pop!_OS

## 1. Check Swap

```bash
swapon --show
```

If nothing appears, you need to create swap.

Check RAM:

```bash
free -h
```

Recommended: Swap >= RAM

---

## 2. Find Swap UUID

```bash
blkid
```

Example output:

```
/dev/sda3: UUID="xxxx-xxxx" TYPE="swap"
```

Copy the UUID.

---

## 3. Configure GRUB

Edit grub config:

```bash
sudo nano /etc/default/grub
```

Find:

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
```

Change to:

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash resume=UUID=YOUR_SWAP_UUID"
```

---

## 4. Update GRUB

```bash
sudo update-grub
```

---

## 5. Test Hibernate

```bash
systemctl hibernate
```

---

# Fedora

Fedora uses Dracut instead of initramfs-tools, so the process differs slightly.

## 1. Check Swap

```bash
swapon --show
```

---

## 2. Find Swap UUID

```bash
blkid
```

---

## 3. Add Resume Parameter

Edit grub config:

```bash
sudo nano /etc/default/grub
```

Modify:

```
GRUB_CMDLINE_LINUX="resume=UUID=YOUR_SWAP_UUID"
```

---

## 4. Rebuild Grub

BIOS systems:

```bash
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
```

UEFI systems:

```bash
sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg
```

---

## 5. Rebuild Initramfs

```bash
sudo dracut -f
```

---

## 6. Test Hibernate

```bash
systemctl hibernate
```

---

# Troubleshooting

## Check if system supports hibernate

```bash
cat /sys/power/state
```

If `disk` appears, hibernate is supported.

## Check log

```bash
journalctl -b
```

---

# Notes

- Swap must be large enough for RAM
    
- Swapfile works but swap partition is more reliable
    
- Secure Boot may sometimes interfere with resume