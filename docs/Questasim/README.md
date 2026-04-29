# QuestaSim Installation Guide (Ubuntu 20.04)

## 0. Install Dependencies

```bash
sudo apt install libxft2 libxft2:i386 lib32ncurses6
sudo apt install libxext6
sudo apt install libxext6:i386
```

---

## 1. License Generation

### 1.1 Install Python 2

Install Python 2 as described in the file `how to install python 2.md`.

### 1.2 Get MAC Address (hostid)

```bash
ip addr show
```

### 1.3 Generate License

```bash
cd /path/to/mgclicgen.py
python2 mgclicgen.py <hostid>
```

### 1.4 License File

- A file named `license.dat` will be generated.
    
- You will copy it later to the QuestaSim installation directory.
    

---

## 2. Install QuestaSim

```bash
./path/to/questa_sim-2021.2_1.aol
```

---

## 3. Copy License Files & Verify

```bash
cp /path/to/license.dat   /path/to/questasim
cp /path/to/pubkey_verify /path/to/questasim
./path/to/pubkey_verify -y
```

---

## 4. Configure Environment Variables

```bash
export PATH="/path/to/questasim/linux_x86_64":$PATH
export PATH="/path/to/questasim/RUVM_2021.2":$PATH
export LM_LICENSE_FILE="/path/to/license.dat":$LM_LICENSE_FILE
```

Apply changes:

```bash
sudo nano ~/.bashrc
source ~/.bashrc
```

---

## 4.999 Run QuestaSim

Now you can run QuestaSim (use another terminal window if needed):

```bash
vsim
```

---

## 5. Optional Enhancements

### 5.1 Add Icon

```bash
cp QuestaSim.png /home/jo/myApps/questasim2021/
```

### 5.2 Create Desktop Entry

```bash
nano ~/.local/share/applications/questasim.desktop
```

### 5.3 Desktop Entry Content

> Replace paths with your actual installation paths.

```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=QuestaSim
Comment=Mentor Graphics QuestaSim
Exec=/home/jo/myApps/questasim2021/questasim/bin/vsim -gui
Path=/home/jo/Documents/QuestaSim
Icon=/home/jo/myApps/questasim2021/QuestaSim.png
Terminal=false
Categories=Development;
StartupNotify=true
StartupWMClass=Vsim
```

### 5.4 Make Desktop File Executable

```bash
chmod +x ~/.local/share/applications/questasim.desktop
gio set ~/.local/share/applications/questasim.desktop metadata::trusted true
```

### 5.5 Update Desktop Database

```bash
update-desktop-database ~/.local/share/applications
```

### 5.6 Run QuestaSim

```bash
vsim
```

---

## Done 🎉

Enjoy using QuestaSim!