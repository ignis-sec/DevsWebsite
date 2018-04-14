var formData, xhr;
var onDrag;





var holder = document.getElementById('holder'),
    tests = {
      filereader: typeof FileReader != 'undefined',
      dnd: 'draggable' in document.createElement('span'),
      formdata: !!window.FormData,
      progress: "upload" in new XMLHttpRequest
    }, 
    support = {
      filereader: document.getElementById('filereader'),
      formdata: document.getElementById('formdata'),
      progress: document.getElementById('progress')
    },
    acceptedTypes = {
      'image/png': true,
      'image/jpeg': true,
      'image/gif': true
    },
    progress = document.getElementById('uploadprogress'),
    fileupload = document.getElementById('upload');

"filereader formdata progress".split(' ').forEach(function (api) {
  if (tests[api] === false) {
    support[api].className = 'fail';
  } else {
    // FFS. I could have done el.hidden = true, but IE doesn't support
    // hidden, so I tried to create a polyfill that would extend the
    // Element.prototype, but then IE10 doesn't even give me access
    // to the Element object. Brilliant.
    support[api].className = 'hidden';
  }
});

function previewfile(file) {
  if (tests.filereader === true && acceptedTypes[file.type] === true) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var image = new Image();
      image.src = event.target.result;
      image.width = 250; // a fake resize
      holder.appendChild(image);
    };

    reader.readAsDataURL(file);
  }  else {
    holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
  }
}

function readfiles(files) {
    formData = tests.formdata ? new FormData() : null;
    if(files.length==0) return false;
    for (var i = 0; i < files.length; i++) {
      if (tests.formdata) {
        var link= document.getElementById('link');              
        var sub= document.getElementById('sub'); 
        formData.append('file', files[i]);
        link.value = sub.value  + files[i].name;
        formData.append('filename', files[i].name);
      }
      previewfile(files[i]);
    }

    // now post a new XHR request
    if (tests.formdata) {
      xhr = new XMLHttpRequest();
      xhr.open('POST', document.getElementById('action').value);
      xhr.onload = function() {
        progress.value = progress.innerHTML = 100;
      };

      if (tests.progress) {
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            var complete = (event.loaded / event.total * 100 | 0);
            progress.value = progress.innerHTML = complete;
          }
        }
      }

      //xhr.send(formData);
    }
}


var dragCount = 51;
var droppedBefore = false
if (tests.dnd) { 
  holder.ondragover = function () { this.className = 'hover'; droppedBefore=true; return false; };
  holder.ondragend = function () { this.className = ''; return false; };
  holder.ondragexit = function () {this.className = ''; return false;}
  holder.ondragleave = function () {if(droppedBefore){this.className = 'leave'; dragCount=0; refreshBox();} return false;}
  holder.ondrop = function (e) {
    this.className = 'drop';
    e.preventDefault();
    readfiles(e.dataTransfer.files);
    onDrag=false;
  }
} else {
  fileupload.className = 'hidden';
  fileupload.querySelector('input').onchange = function () {
    readfiles(this.files);
  };
}


function sendForm()
{
  if(!formData) formData = tests.formdata ? new FormData() : null;
  var inputs = document.getElementsByClassName('formelem');
  xhr = new XMLHttpRequest();
  xhr.open('POST', document.getElementById('action').value);
  for (var i = 0; i < inputs.length; ++i) {
    var item = inputs[i];  
    formData.append(item.name, item.value);
  }
  xhr.send(formData);

}

function refreshBox(){
  var ref=setInterval(()=> {
    if(dragCount>1)
    {
      if(holder.className='leave')holder.className = '';
      clearTimeout(ref);
    }
    dragCount++;
  }, 1000)
}




