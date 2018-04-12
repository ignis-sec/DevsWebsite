var dragDrop = require('drag-drop')
 


dragDrop('#dropTarget', {
  onDrop: function (files, pos) {
  //console.log('Here are the dropped files', files)
  var input = document.getElementById('file');
  var filename = document.getElementById('filename');
  var pdf = document.getElementById('pdf');
    pdf.value = /projects/+file.name;
    filename.value = file.name;
  // `files` is an Array!
  files.forEach(function (file) {
    pdf.value = /projects/+file.name;
    filename.value = file.name;
 
    // convert the file to a Buffer that we can use!
    var reader = new FileReader()
    reader.addEventListener('load', function (e) {
      // e.target.result is an ArrayBuffer
      var arr = new Uint8Array(e.target.result)
      var buffer = new Buffer(arr)
      input.value=buffer;
      // do something with the buffer!
    })
    reader.addEventListener('error', function (err) {
      console.error('FileReader error' + err)
    })
    reader.readAsArrayBuffer(file)


  })
  },
  onDragEnter: function () {
    var target = document.getElementById('dropTarget');
    target.style.backgroundColor = '#ff7575';
    target.style.border = "thick dashed #ff5555"
    target.innerHTML = '<h2 style="margin-top:60px;text-align:center;color:#565972"> Drop your files to upload </h2>'
  },
  onDragOver: function () {
      var target = document.getElementById('dropTarget');
      target.style.backgroundColor = '#ff7575';
      target.style.border = "thick dashed #ff5555"
      target.innerHTML = '<h2 style="margin-top:60px;text-align:center;color:#565972"> Drop your files to upload </h2>'
  },
  onDragLeave: function () {
      var target = document.getElementById('dropTarget');
      target.style.backgroundColor = "white"
      target.style.border = "none"
      target.innerHTML = ''
  }
})

