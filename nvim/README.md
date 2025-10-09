## Install Recipes

Below you can find OS specific install instructions for Neovim and dependencies.

After installing all the dependencies continue with the [Install Kickstart](#Install-Kickstart) step.

#### Windows Installation

<details><summary>Windows with Microsoft C++ Build Tools and CMake</summary>
Installation may require installing build tools and updating the run command for `telescope-fzf-native`

See `telescope-fzf-native` documentation for [more details](https://github.com/nvim-telescope/telescope-fzf-native.nvim#installation)

This requires:

- Install CMake and the Microsoft C++ Build Tools on Windows

```lua
{'nvim-telescope/telescope-fzf-native.nvim', build = 'cmake -S. -Bbuild -DCMAKE_BUILD_TYPE=Release && cmake --build build --config Release && cmake --install build --prefix build' }
```

</details>
<details><summary>Windows with gcc/make using chocolatey</summary>
Alternatively, one can install gcc and make which don't require changing the config,
the easiest way is to use choco:

1. install [chocolatey](https://chocolatey.org/install)
either follow the instructions on the page or use winget,
run in cmd as **admin**:

```
winget install --accept-source-agreements chocolatey.chocolatey
```

2. install all requirements using choco, exit the previous cmd and
open a new one so that choco path is set, and run in cmd as **admin**:

```
choco install -y neovim git ripgrep wget fd unzip gzip mingw make
```

</details>
<details><summary>WSL (Windows Subsystem for Linux)</summary>

```
wsl --install
wsl
sudo add-apt-repository ppa:neovim-ppa/unstable -y
sudo apt update
sudo apt install make gcc ripgrep unzip git xclip neovim
```

</details>

#### Linux Install

<details><summary>Ubuntu Install Steps</summary>

```
sudo add-apt-repository ppa:neovim-ppa/unstable -y
sudo apt update
sudo apt install make gcc ripgrep unzip git xclip neovim
```

</details>
<details><summary>Debian Install Steps</summary>

```
sudo apt update
sudo apt install make gcc ripgrep unzip git xclip curl

# Now we install nvim
curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim-linux-x86_64.tar.gz
sudo rm -rf /opt/nvim-linux-x86_64
sudo mkdir -p /opt/nvim-linux-x86_64
sudo chmod a+rX /opt/nvim-linux-x86_64
sudo tar -C /opt -xzf nvim-linux-x86_64.tar.gz

# make it available in /usr/local/bin, distro installs to /usr/bin
sudo ln -sf /opt/nvim-linux-x86_64/bin/nvim /usr/local/bin/
```

</details>
<details><summary>Fedora Install Steps</summary>

```
sudo dnf install -y gcc make git ripgrep fd-find unzip neovim
```

</details>


## Clone Lua
```bash
git clone https://github.com/nvim-lua/kickstart.nvim.git "${XDG_CONFIG_HOME:-$HOME/.config}"/nvim
```
`~/.config/nvim/`

```plaintext
├── after
│   ├── ftplugin
│   │   ├── c.lua
│   │   └── cpp.lua
│   └── plugin
│       ├── clangd.lua
│       └── terminal.lua
├── doc
│   ├── kickstart.txt
│   └── tags
├── init.lua
├── lazy-lock.json
├── LICENSE.md
├── lua
│   ├── clangd.lua
│   ├── custom
│   │   └── plugins
│   │       ├── init.lua
│   │       ├── theme.lua
│   │       └── themes.lua
│   └── kickstart
│       ├── health.lua
│       └── plugins
│           ├── autopairs.lua
│           ├── debug.lua
│           ├── gitsigns.lua
│           ├── indent_line.lua
│           ├── lint.lua
│           └── neo-tree.lua
├── nvim
│   ├── init.lua
│   ├── lua
│   │   ├── community.lua
│   │   ├── lazy_setup.lua
│   │   ├── plugins
│   │   │   ├── astrocore.lua
│   │   │   ├── astrolsp.lua
│   │   │   ├── astroui.lua
│   │   │   ├── mason.lua
│   │   │   ├── none-ls.lua
│   │   │   ├── treesitter.lua
│   │   │   └── user.lua
│   │   └── polish.lua
│   ├── neovim.yml
│   ├── README.md
│   └── selene.toml
└── README.md

