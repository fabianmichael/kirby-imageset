export default function(img, success, failure = function(){}) {

  if(img.complete && (typeof img.naturalWidth !== 'undefined') && img.naturalWidth > 0) {
    // immediately execute callback, if image is already loaded.
    success();
    return;
  }

  var successCallback = function () {
    this.removeEventListener('load', successCallback);
    success();
  };

  img.addEventListener('load', successCallback);

  if(failure) {
    var testImg = new Image();
    testImg.addEventListener('error', function() {
      failure();
    });
    testImg.src = img.src;
  }

}