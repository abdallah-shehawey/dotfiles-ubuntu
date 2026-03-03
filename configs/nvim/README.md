# 🧠 Neovim Setup Guide (Fedora)

This guide explains how to install Neovim and use my custom configuration on Fedora Linux.

---

## 📦 Install Dependencies (Fedora)

```bash
sudo dnf install -y gcc make git ripgrep fd-find unzip neovim
```

---

## 🚀 Optional: Install Kickstart Base Config

If you want to start from kickstart.nvim:

```bash
git clone https://github.com/nvim-lua/kickstart.nvim.git "${XDG_CONFIG_HOME:-$HOME/.config}"/nvim
```

---

# 🔥 Use My Neovim Configuration

My Neovim configuration is located inside the repository at:

```
configs/nvim/nvim-config
```

To download and install it correctly:

```bash
# Clone repository without checking out everything
git clone --no-checkout git@github.com:abdallah-shehawey/dotfiles-linux.git
cd dotfiles-linux

# Enable sparse checkout
git sparse-checkout init --cone

# Select only the Neovim config folder
git sparse-checkout set configs/nvim/nvim-config

# Checkout selected files
git checkout

# Copy config to ~/.config/nvim
cp -r configs/nvim/nvim-config "$HOME/.config/nvim"
```

---

## ✅ Final Result

After running the commands above, your Neovim configuration will be located at:

```
/home/abdallah-shehawey/.config/nvim
```

---

## 🛠 Alternative (Move Instead of Copy)

If you prefer moving instead of copying:

```bash
mv configs/nvim/nvim-config "$HOME/.config/nvim"
```

---

## 📌 Notes

- Make sure no existing `~/.config/nvim` folder exists before copying.
    
- If it exists, remove or back it up first:
    

```bash
rm -rf ~/.config/nvim
```

---

Happy hacking ⚡