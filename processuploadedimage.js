
processImage({ imagepath: "mall.jpg",            // the original image
			   thumbpath: "mall_thumbnail.jpg",  // where to save the thumbnail
			   thumbmax: 128,                    // maximum thumbnail dimension
		       saveimagepath: "mall_600.jpg",    // where to save the processed image
		   	   imagemax: 600,                    // maximum image dimension
		   	   watermarkpath: "watermark.png"}); // watermark image


console.log("starting...");


function processImage(options)
{
	const Jimp = require("jimp");

	Jimp.read(options.imagepath)
        .then(async image =>
        {
            console.log("image opened");

            // thumbnail
            const thumbnail = image.clone();
            thumbnail.scaleToFit(options.thumbmax, options.thumbmax);
            thumbnail.writeAsync(options.thumbpath)
                     .then(() => console.log("thumbnail saved"))
                     .catch(err => { console.error(err); });

            // main image
            image.scaleToFit(options.imagemax, options.imagemax);
			await addWatermark(image, options.watermarkpath);
			image.quality(95);
            image.writeAsync(options.saveimagepath)
                 .then(() => console.log("image saved"))
                 .catch(err => { console.error(err); });
        })
        .catch(err =>
        {
            console.error(err);
        });
}


function addWatermark(image, watermarkpath)
{
	const Jimp = require("jimp");

	return Jimp.read(watermarkpath)
        	   .then(watermark =>
        	   {
            		console.log("watermark opened");
            		const x = image.bitmap.width - 32 - watermark.bitmap.width;
            		const y = image.bitmap.height - 32 - watermark.bitmap.height;
            		image.composite(watermark, x, y, { opacitySource: 0.5 });
        		})
        		.catch(err =>
        		{
            		console.error(err);
        		});
}
