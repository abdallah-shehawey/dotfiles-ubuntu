vim.diagnostic.config {
  virtual_text = {
    severity = { min = vim.diagnostic.severity.HINT },
  },
  underline = true,
  update_in_insert = true,
  signs = true,
  severity_sort = true,
}

vim.api.nvim_create_autocmd('CursorHold', {
  callback = function()
    if vim.fn.mode() == 'n' then
      vim.diagnostic.open_float(nil, {
        focus = false,
        border = 'rounded',
      })
    end
  end,
})
