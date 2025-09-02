return {
  {
    'catppuccin/nvim',
    name = 'catppuccin',
    priority = 1000,
    config = function()
      vim.cmd.colorscheme 'catppuccin'
    end,
  },
  {
    'folke/tokyonight.nvim',
    name = 'tokyonight',
    priority = 1000,
    -- config = function()
    --   vim.cmd.colorscheme("tokyonight")
    -- end,
  },
  {
    'ellisonleao/gruvbox.nvim',
    name = 'gruvbox',
    priority = 1000,
    -- config = function()
    --   vim.cmd.colorscheme("gruvbox")
    -- end,
  },
  {
    'sainnhe/everforest',
    name = 'everforest',
    priority = 1000,
    -- config = function()
    --   vim.cmd.colorscheme("everforest")
    -- end,
  },
}
