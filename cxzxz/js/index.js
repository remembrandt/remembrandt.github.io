$('.draggable-handler').mousedown(function(e){
  drag = $(this).closest('.draggable')
  drag.addClass('dragging')
  drag.css('left', e.clientX-$(this).width()/2)
  drag.css('top', e.clientY-$(this).height()/2 - 10)
  $(this).on('mousemove', function(e){    
    drag.css('left', e.clientX-$(this).width()/2)
    drag.css('top', e.clientY-$(this).height()/2 - 10)
    window.getSelection().removeAllRanges()
  })
})

$('.draggable-handler').mouseleave(stopDragging)
$('.draggable-handler').mouseup(stopDragging)

function stopDragging(){
  drag = $(this).closest('.draggable')
  drag.removeClass('dragging')
  $(this).off('mousemove')
}