$(document).delegate('#body', 'keydown', function(e) {
  var keyCode = e.keyCode || e.which;

  if (keyCode == 9) {
    e.preventDefault();
    var start = this.selectionStart;
    var end = this.selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    var selected = getSelectionText();
    if( selected == "")
    {
      $(this).val($(this).val().substring(0, start)
      + "\t"
      + $(this).val().substring(end));
    }else{
      selected = selected.replace(/\n/g, "\n\t");
      console.log(selected);
      $(this).val($(this).val().substring(0, start)
      + selected
      + $(this).val().substring(end));
    }
    

    // put caret at right position again
    this.selectionStart =
    this.selectionEnd = start + 1;
  }
}); 

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
} 