--- Compatibility shim for nvim-treesitter's `master` branch on Neovim 0.12.
---
--- The master branch was archived on 2025-05-18 and never adapted to the query
--- API change that landed in Neovim 0.11: a directive/predicate handler used to
--- receive `match[capture_id]` as a single `TSNode`, and now receives a *list*
--- of nodes. Master asked for the old behaviour with `{ all = false }`, which
--- 0.12 no longer honours, so every one of its custom helpers now hands a plain
--- Lua table to functions expecting a node. The visible symptom is
---
---     treesitter.lua:197: attempt to call method 'range' (a nil value)
---
--- thrown by the highlighter on:
---   * `downcase!`               -> bash/ruby/hcl/php heredocs
---   * `set-lang-from-info-string!` -> markdown fenced code blocks
---   * `set-lang-from-mimetype!`    -> html <script type="...">
---   * `nth?`, `is?`, `kind-eq?`    -> assorted highlight queries
---
--- Each one is re-registered below with identical semantics, reading the first
--- node out of the list. Drop this file once the config moves to the
--- nvim-treesitter `main` branch.

local query = require 'vim.treesitter.query'

local M = {}

--- `match[id]` is a `TSNode[]` on 0.11+ and a bare `TSNode` before that.
---@return TSNode|nil
local function first_node(match, id)
  local value = match[id]
  if type(value) == 'table' and not value.range then
    return value[1]
  end
  return value
end

local html_script_type_languages = {
  ['importmap'] = 'json',
  ['module'] = 'javascript',
  ['application/ecmascript'] = 'javascript',
  ['text/ecmascript'] = 'javascript',
}

local injection_language_aliases = {
  ex = 'elixir',
  pl = 'perl',
  sh = 'bash',
  uxn = 'uxntal',
  ts = 'typescript',
}

local function parser_from_info_string(alias)
  local match = vim.filetype.match { filename = 'a.' .. alias }
  return match or injection_language_aliases[alias] or alias
end

function M.setup()
  local opts = { force = true }

  -- Lower-cases a capture's text, so `@injection.language` matches regardless
  -- of how the heredoc terminator was written (USAGE -> usage).
  query.add_directive('downcase!', function(match, _, source, pred, metadata)
    local id = pred[2]
    local node = first_node(match, id)
    if not node then
      return
    end

    local text = vim.treesitter.get_node_text(node, source, { metadata = metadata[id] }) or ''
    if not metadata[id] then
      metadata[id] = {}
    end
    metadata[id].text = text:lower()
  end, opts)

  -- ```lua ... ``` in markdown: turn the info string into a parser name.
  query.add_directive('set-lang-from-info-string!', function(match, _, source, pred, metadata)
    local node = first_node(match, pred[2])
    if not node then
      return
    end

    local alias = vim.treesitter.get_node_text(node, source):lower()
    metadata['injection.language'] = parser_from_info_string(alias)
  end, opts)

  -- <script type="module"> and friends.
  query.add_directive('set-lang-from-mimetype!', function(match, _, source, pred, metadata)
    local node = first_node(match, pred[2])
    if not node then
      return
    end

    local mimetype = vim.treesitter.get_node_text(node, source)
    local configured = html_script_type_languages[mimetype]
    if configured then
      metadata['injection.language'] = configured
    else
      local parts = vim.split(mimetype, '/', {})
      metadata['injection.language'] = parts[#parts]
    end
  end, opts)

  -- True when the node is its parent's nth named child.
  query.add_predicate('nth?', function(match, _, _, pred)
    local node = first_node(match, pred[2])
    local n = tonumber(pred[3])
    local parent = node and node:parent()
    if parent and n and parent:named_child_count() > n then
      return parent:named_child(n) == node
    end
    return false
  end, opts)

  -- True when the definition the node resolves to is of one of the given kinds.
  query.add_predicate('is?', function(match, _, source, pred)
    local node = first_node(match, pred[2])
    if not node then
      return true
    end

    -- Required lazily: nvim-treesitter.locals pulls in half the plugin.
    local ok, locals = pcall(require, 'nvim-treesitter.locals')
    if not ok then
      return true
    end

    local _, _, kind = locals.find_definition(node, source)
    return vim.tbl_contains({ unpack(pred, 3) }, kind)
  end, opts)

  -- True when the node's type is one of the given types.
  query.add_predicate('kind-eq?', function(match, _, _, pred)
    local node = first_node(match, pred[2])
    if not node then
      return true
    end
    return vim.tbl_contains({ unpack(pred, 3) }, node:type())
  end, opts)
end

return M
