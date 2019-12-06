var CG = (function(CG) {
  CG.ImageLoader = {
    _images: {},

    load: function(imageList, callback) {
      let image_count = 0;

      if (imageList.length > 0) {
        imageList.forEach(image_src => {
          let img = new Image();

          img.addEventListener("load", (evt) => {
            this._images[image_src] = img;
            image_count++;

            if (image_count == imageList.length) {
              callback();
            }
          });

          img.addEventListener("error", (evt) => {
            throw `Error loading image: ${img.src}`;
          });

          img.src = image_src;
        });
      }
      else {
        callback();
      }
    },

    getImage: function(image_name) {
      if (this._images[image_name]) {
        return this._images[image_name];
      }

      throw `Error loading image: ${image_name}`;
    }
  };

  return CG;
}(CG || {}));
