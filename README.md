# Storyblok Image Service

[Storyblok Image Service](https://www.storyblok.com/docs/image-service) JS SDK.

- 🚀 Production Ready!
- ✔️ 100% Code Coverage!
- ☑️ Out-of-the-box Typescript Support!
- 📦 No Dependencies!
- ✨ Awesome DX!

Storyblok offers an [Image Service](https://www.storyblok.com/docs/image-service) to pre-process images hosted on your Storyblok space, so that you can resize, crop, optimize and add other awesome filters to your images **on the fly**, which frees the marketing/content/design team from having to deal with any of these concerns themselves.

Use this SDK to make processing your Storyblok-hosted images easier than ever!

## Installation

```sh
npm install storyblok-image-service
```

## Usage

```ts
import { imageUrl } from "storyblok-image-service";

const originalImageUrl =
  "https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg";

const processedImageUrl = imageUrl(originalImageUrl, {
  resize: {
    height: 100,
    width: 1200,
  },
  quality: 80,
});
```

## Features

Most features come from Storyblok Image Service itself:

- Automatic WebP Detection
- Image Resizing/Cropping
- Smart Focus for Human Faces
- Image Quality
- Blurring
- Image Format Conversion (e.g. jpeg, png, webp)
- Rotating
- Flippling
- Brightness
- Grayscale

Besides these image processing features offered by Storyblok Image Service, this SDK offers a friendly API that is **easy to use correctly** and also adopts a very **defensive approach**, which even if for some reason you pass invalid values, it will try to correct them to reasonable approximate values to avoid breaking the image service and hence having broken images.

## API

This lib exposes a single function `imageUrl` that takes the original Storyblok-hosted image URL and some parameters and returns the URL of the processed image.

### imageUrl

```ts
declare const imageUrl = (
  originalImageUrl: string,
  parameters: {
    /**
     * Force a specific image format.
     * Supported formats are "webp", "jpeg" and "png".
     *
     * If not set, Storyblok Image Service will detect
     * whether the user's browser has support to WebP,
     * and then either send the image in WebP or fallback
     * to JPG.
     */
    format?: "webp" | "jpeg" | "png";

    /**
     * Request a specific image quality.
     *
     * Ranges from 0 to 100.
     *
     * Defaults to 100.
     *
     * Floats will be rounded, negative values will be
     * brought to 0, values over 100 will be brought
     * to 100 and an error will be issued.
     */
    quality?: number;

    /**
     * Rotates image counter clockwise by a given angle
     * in degrees.
     *
     * Supported values are integer (negative included) multiples of 90deg.
     * E.g. ... -270, -180, -90, 0, 90, 180, 270 ...
     *
     * Floats will be rounded to the nearest integer.
     *
     * Defaults to 0deg (no rotation).
     */
    rotate?: number;

    /**
     * Displays image in black and white.
     *
     * Defaults to false.
     */
    grayscale?: boolean;

    /**
     * Blurs image.
     *
     * Defaults to no blur.
     */
    blur?: {
      /**
       * An int value between 0 and 150.
       * The higher the number, the more blurred the image will be.
       *
       * Floats will be rounded, negative values will be
       * brought to 0, values over 150 will be brought
       * to 150 and an error will be issued.
       */
      radius: number;

      /**
       * Sigma is used in the gaussian function for blurring.\
       *
       * Defaults to the same value as the radius.
       *
       * Floats will be rounded, negative values will be
       * brought to 0, values over 150 will be brought
       * to 150 and an error will be issued.
       */
      sigma?: number;
    };

    /**
     * Flips image vertically, horizontally,
     * or both.
     *
     * Defaults to no flip.
     */
    flip?: {
      horizontal?: boolean;
      vertical?: boolean;
    };

    /**
     * Sets the image's brightness.
     *
     * Ranges from -100 to 100.
     *
     * Defaults to 0.
     *
     * Floats will be rounded, values below -100 will be
     * brought to -100, values over 100 will be brought
     * to 100 and an error will be issued.
     */
    brightness?: number;

    /**
     * Resizes the image by defining either its new height,
     * width, or both.
     *
     * When setting only the height or only the width, the unset
     * dimension will be adjusted accordingly so that no cropping
     * occurs.
     *
     * When setting both width and height, it's possible (and likely)
     * that the image has to be cropped to maintain the image's
     * aspect ratio, which opens up some other possibilities,
     * like making the image 'fit-in' or defining a focal point.
     *
     * When making an image 'fit-in' we resize the image
     * without cropping, while padding any "blank" space that might
     * result from the resizing so that the
     * resized image + padding reaches the desired dimensions.
     */
    resize?: {
      height?: number;
      width?: number;

      /**
       * When enabled, resizes the image so that it
       * fits entirely within the desired size, while padding
       * the remaining space.
       */
      fitIn?: boolean;

      /**
       * When using 'fitIn', sets the color of the padded space.
       */
      fill?: string;
      focalPoint?:
        | "smart"
        | {
            /**
             * Focal point rectangle's left-top point
             * X coordinate.
             *
             * Floats will be rounded, negative values will be
             * brought to 0 and an error will be issued.
             */
            left: number;

            /**
             * Focal point rectangle's left-top point
             * y coordinate.
             *
             * Floats will be rounded, negative values will be
             * brought to 0 and an error will be issued.
             */
            top: number;

            /**
             * Focal point rectangle's right-bottom point
             * X coordinate.
             *
             * Floats will be rounded, negative values will be
             * brought to 0 and an error will be issued.
             */
            right: number;

            /**
             * Focal point rectangle's right-bottom point
             * Y coordinate.
             *
             * Floats will be rounded, negative values will be
             * brought to 0 and an error will be issued.
             */
            bottom: number;
          };
    };

    /**
     * Crops image by defining a rectangle
     * that will be used to do the cropping.
     *
     * The rectangle is defined through two points,
     * the top-left and the bottom-right.
     *
     * Coordinates (0, 0) correspond to the image's
     * top-left corner, and they increase from
     * top to bottom and from left to right.
     *
     * Cropping is a form of resizing the image,
     * therefore it's not possible to use 'crop'
     * and 'resize' params at the same time.
     * They are mutually exclusive, so if you use one,
     * you cannot use the other and vice versa.
     */
    crop?: {
      /**
       * Crop rectangle's left-top point
       * X coordinate.
       *
       * Floats will be rounded, negative values will be
       * brought to 0 and an error will be issued.
       */
      left: number;

      /**
       * Crop rectangle's left-top point
       * Y coordinate.
       *
       * Floats will be rounded, negative values will be
       * brought to 0 and an error will be issued.
       */
      top: number;

      /**
       * Crop rectangle's left-top point
       * X coordinate.
       *
       * Floats will be rounded, negative values will be
       * brought to 0 and an error will be issued.
       */
      right: number;

      /**
       * Crop rectangle's left-top point
       * Y coordinate.
       *
       * Floats will be rounded, negative values will be
       * brought to 0 and an error will be issued.
       */
      bottom: number;
    };
  },
  options?: {
    /**
     * You may use this callback to route errors
     * wherever you wish.
     */
    onError?: (errors: Array<string>) => void;
  }
) => string;
```
