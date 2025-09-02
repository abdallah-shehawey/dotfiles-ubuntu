# Auto Start Whatsapp and Telegram

## WhatsApp

### Step 1: Create WhatsApp Hidden Startup Script
```bash
nvim ~/.local/bin/whatsapp-hidden.sh 
```
### Step 2: Install wmctrl if not installed
```bash
sudo apt update && sudo apt install -y wmctrl
```
### Step 3: Create the Script
```bash
#!/bin/bash

# Launch WhatsApp Desktop via Flatpak
flatpak run io.github.mimbrero.WhatsAppDesktop &

# Wait for the app to start
sleep 2

# Close WhatsApp window to keep it hidden
wmctrl -c "WhatsApp"
```
### Step 4: Make Script Executable
```bash
chmod +x ~/.local/bin/whatsapp-hidden.sh
```
### Step 5: Create Autostart Desktop Entry for WhatsApp
```bash
nvim ~/.config/autostart/whatsapp.desktop 
```
### Step 6: Add the following content to the file
```bash
[Desktop Entry]
Type=Application
Name=WhatsApp (Hidden)
Exec=/home/abdallah-shehawey/.local/bin/whatsapp-hidden.sh
X-GNOME-Autostart-enabled=true
Hidden=false
NoDisplay=false
X-GNOME-Autostart-Delay=2
```
### Step 7: Make the Desktop Entry File Executable
```bash
chmod +x ~/.config/autostart/whatsapp.desktop
```
### After all of them try 
* remove Whatsapp-hidden and modify whatsapp.desktop
```bash
nvim ~/.config/autostart/whatsapp.desktop 
```
```bash
[Desktop Entry]
Type=Application
Name=WhatsApp (Hidden)
Exec=flatpak run io.github.mimbrero.WhatsAppDesktop --start-hidden
X-GNOME-Autostart-enabled=true
Hidden=false
NoDisplay=false
X-GNOME-Autostart-Delay=2
```

## Telgram

### Step 1: Create Autostart Desktop Entry for Telegram
```bash
nvim ~/.config/autostart/telegram.desktop
```
### Step 2: Add the following content to the file
```bash
[Desktop Entry]
Type=Application
Name=Telegram (Flatpak)
Exec=flatpak run org.telegram.desktop -startintray
X-GNOME-Autostart-enabled=true