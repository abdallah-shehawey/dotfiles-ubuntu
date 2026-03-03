vim.api.nvim_create_autocmd('VimEnter', {
  callback = function()
    pcall(vim.keymap.del, 'n', '<leader>th')

    vim.keymap.set('n', '<leader>th', ':split | terminal<CR>i', { desc = 'Open terminal in horizontal split', silent = true })
    vim.keymap.set('n', '<leader>tv', ':vsplit | terminal<CR>i', { desc = 'Open terminal in vertical split', silent = true })
    vim.keymap.set('n', '<leader>tt', ':tabnew | terminal<CR>i', { desc = 'Open terminal in new tab', silent = true })

    vim.keymap.set('t', '<Esc>', [[<C-\><C-n>]], { desc = 'Terminal normal mode', silent = true })
  end,
})
