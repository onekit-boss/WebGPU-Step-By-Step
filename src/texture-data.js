export const GetTexture = async(device, imageName, 
    addressModeU = 'repeat',addressModeV = 'repeat') => {

    // get image file
    const img = document.createElement('img');
    img.src = './assets/' + imageName;
    await img.decode();
    const imageBitmap = await createImageBitmap(img);

    // create sampler with linear filtering for smooth interpolation 
    const sampler = device.createSampler({
        minFilter: 'linear',
        magFilter: 'linear',
        addressModeU: addressModeU ,
        addressModeV: addressModeV 
    });       

    // create texture
    const texture = device.createTexture({
        size: [imageBitmap.width, imageBitmap.height, 1],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | 
               GPUTextureUsage.COPY_DST | 
               GPUTextureUsage.RENDER_ATTACHMENT
    });

    device.queue.copyExternalImageToTexture(
        { source: imageBitmap },
        { texture: texture },
        [imageBitmap.width, imageBitmap.height]
    );

    return {
        texture,
        sampler
    }
}