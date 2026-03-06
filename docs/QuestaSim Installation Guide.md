# QuestaSim 2021.2 Installation Guide (Ubuntu / Fedora)

This guide explains how to install and run QuestaSim 2021.2 on modern Linux distributions such as **Ubuntu** and **Fedora**.

---

# 1. Install Required Dependencies

## Ubuntu / Debian

```bash
sudo dpkg --add-architecture i386
sudo apt update

sudo apt install -y \
libxft2 libxft2:i386 \
lib32ncurses6 \
libxext6 libxext6:i386 \
build-essential wget curl
```

## Fedora

```bash
sudo dnf install -y \
libXft libXft.i686 \
ncurses-compat-libs.i686 \
libXext libXext.i686 \
gcc gcc-c++ make wget curl
```

---

# 2. Install Python 2.7 (Required for License Generator)

Questa license generator scripts usually require **Python 2.7**, which is no longer provided by default in modern distributions.

Download and build Python 2.7:

```bash
wget https://www.python.org/ftp/python/2.7.18/Python-2.7.18.tgz

tar xvf Python-2.7.18.tgz
cd Python-2.7.18

./configure --enable-optimizations
make -j$(nproc)
sudo make altinstall
```

Verify installation:

```bash
python2.7 --version
```

Create compatibility symlink:

```bash
sudo ln -s /usr/local/bin/python2.7 /usr/local/bin/python2
```

---

# 3. Install pip for Python 2

```bash
curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o get-pip.py

sudo python2.7 get-pip.py

pip2 --version
python2 --version
```

---

# 4. Generate License

First get your **host ID**:

```bash
ip addr show
```

Then run the license generator:

```bash
cd /path/to/mgclicgen

python2 mgclicgen.py <hostid>
```

This will generate:

```
license.dat
```

---

# 5. Install QuestaSim

Run the installer:

```bash
./path/to/questa_sim-2021.2_1.aol
```

Follow the GUI installer steps.

Example installation path:

```
/opt/questasim
```

---

# 6. Copy License Files

Copy the generated license and verification tool:

```bash
cp /path/to/license.dat /path/to/pubkey_verify /path/to/questasim
```

Run verification:

```bash
./pubkey_verify -y
```

---

# 7. Configure Environment Variables

Add QuestaSim binaries to PATH and configure the license file.

Temporary (current shell):

```bash
export PATH="/path/to/questasim/linux_x86_64:$PATH"
export PATH="/path/to/questasim/RUVM_2021.2:$PATH"
export LM_LICENSE_FILE="/path/to/license.dat:$LM_LICENSE_FILE"
```

Permanent configuration:

```bash
nano ~/.bashrc
```

Add:

```bash
export PATH="/path/to/questasim/linux_x86_64:$PATH"
export PATH="/path/to/questasim/RUVM_2021.2:$PATH"
export LM_LICENSE_FILE="/path/to/license.dat:$LM_LICENSE_FILE"
```

Reload configuration:

```bash
source ~/.bashrc
```

---

# 8. Test Installation

Run:

```bash
vsim
```

If the GUI opens without license errors, the installation is successful.

---

# Notes

- QuestaSim requires **32-bit compatibility libraries**.
    
- Python 2.7 is required only for license generation.
    
- Fedora users must ensure `.i686` libraries are installed.
    

---

# Author

Original steps by **Abdelrahman Adawy**  
Formatting and README organization by **Abdallah Shehawey**