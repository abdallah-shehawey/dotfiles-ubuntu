#### Install the basic packages for building from source

```bash
sudo apt update
sudo apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget
```

#### Download Python 2.7.18 and extract tar file

```bash
cd ~/Downloads

# This command downloads 'Python-2.7.18.tgz' (from the internet).
# You should already find this file attached with the 'readme.txt'.
wget https://www.python.org/ftp/python/2.7.18/Python-2.7.18.tgz

# Extract the archive
tar -xf Python-2.7.18.tgz
cd Python-2.7.18
```

#### Install Python 2.7.18 in a specific location

```bash
# Replace this path with your desired install location
./configure --prefix=/home/jo/myApps/python2 --enable-optimizations
make
make install
```

#### Create alias `python2`

```bash
# Open .bashrc
nano ~/.bashrc
```

Add this line at the end of the file:

```bash
# Replace with your install path
alias python2='/home/jo/myApps/python2/bin/python'
```

Apply changes:

```bash
source ~/.bashrc
```

Verify:

```bash
python2 --version
```

Expected output:

```
Python 2.7.18
```

---

## Alternative Solution (Virtual Environment)

#### Install pip for Python 2.7

```bash
wget https://bootstrap.pypa.io/pip/2.7/get-pip.py
python2 get-pip.py
```

#### Install virtualenv

```bash
python2 -m pip install virtualenv
```

#### Create a virtual environment

```bash
# Replace paths as needed
/home/jo/myApps/python2/bin/virtualenv ~/myApps/python_env/python2_env
```

#### Activate environment

```bash
source ~/myApps/python_env/python2_env/bin/activate
```

#### Verify Python version

```bash
python -V
```

Expected output:

```
Python 2.7.18
```

#### Deactivate environment

```bash
deactivate
```

---

### Reuse the environment later

Activate:

```bash
source ~/myApps/python_env/python2_env/bin/activate
```

Deactivate:

```bash
deactivate
```
