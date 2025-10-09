vim.api.nvim_create_autocmd('FileType', {
  pattern = { 'c', 'cpp', 'objc', 'objcpp' },
  callback = function()
    vim.lsp.start {
      name = 'clangd',
      cmd = { 'clangd', '--header-insertion=never', '--inlay-hints=false' },
      root_dir = vim.fs.dirname(vim.fs.find({ '.git', 'compile_commands.json' }, { upward = true })[1]),
    }
  end,
})
