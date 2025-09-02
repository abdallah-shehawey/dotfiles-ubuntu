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

