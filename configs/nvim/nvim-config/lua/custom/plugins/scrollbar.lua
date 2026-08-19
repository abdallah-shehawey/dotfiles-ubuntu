return {
  'petertriho/nvim-scrollbar',
  event = 'BufReadPost',
  config = function()
    require('scrollbar').setup {
      show = true,
      handle = {
        text = ' ',
      },
    }
  end,
}
