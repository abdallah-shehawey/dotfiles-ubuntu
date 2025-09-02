local lspconfig = require("lspconfig")

lspconfig.clangd.setup {
  cmd = { "clangd", "--header-insertion=never", "--inlay-hints=false" },
}
local lspconfig = require("lspconfig")

lspconfig.clangd.setup {
  cmd = { "clangd", "--header-insertion=never", "--inlay-hints=false" },
}

