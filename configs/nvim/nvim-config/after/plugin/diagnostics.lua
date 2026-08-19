-- Diagnostic tweaks layered on top of the config in init.lua.
--
-- NOTE: only list the keys that actually differ. `vim.diagnostic.config` replaces
-- each key it is given, so passing e.g. `signs = true` here would throw away the
-- Nerd Font sign icons that init.lua sets up.
vim.diagnostic.config {
  underline = true, -- init.lua underlines errors only; underline every severity
}

-- Show the diagnostic under the cursor in a float after `updatetime` (250ms) of
-- idling in normal mode.
vim.api.nvim_create_autocmd('CursorHold', {
  callback = function()
    -- Don't stack a second float on top of the one already open.
    if vim.b.diagnostic_float_win and vim.api.nvim_win_is_valid(vim.b.diagnostic_float_win) then
      return
    end
    local _, win = vim.diagnostic.open_float(nil, {
      focus = false,
      border = 'rounded',
    })
    vim.b.diagnostic_float_win = win
  end,
})
