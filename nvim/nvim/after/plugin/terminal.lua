-- نخلي التغييرات تحصل بعد ما كل حاجة تتحمّل
vim.api.nvim_create_autocmd('VimEnter', {
  callback = function()
    -- امسح مابّنج LSP اللي واخد <leader>th
    pcall(vim.keymap.del, 'n', '<leader>th')

    -- اعمل مابّنج جديد للتيرمنال
    vim.keymap.set('n', '<leader>th', ':split | terminal<CR>i', { desc = 'Open terminal in horizontal split', silent = true })
    vim.keymap.set('n', '<leader>tv', ':vsplit | terminal<CR>i', { desc = 'Open terminal in vertical split', silent = true })
    vim.keymap.set('n', '<leader>tt', ':tabnew | terminal<CR>i', { desc = 'Open terminal in new tab', silent = true })

    -- جوّه التيرمنال: Esc يرجع Normal mode
    vim.keymap.set('t', '<Esc>', [[<C-\><C-n>]], { desc = 'Terminal normal mode', silent = true })
  end,
})
