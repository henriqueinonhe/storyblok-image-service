import { imageUrl, ImageUrlParameters } from ".";

type SetupParams = {
  imageServiceParameters?: ImageUrlParameters;
};

const setup = ({ imageServiceParameters }: SetupParams) => {
  const originalImageUrl =
    "https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg";

  const errors: Array<string> = [];

  const processedImageUrl = imageUrl(originalImageUrl, imageServiceParameters, {
    onError: (entries) => errors.push(...entries),
  });

  return {
    originalImageUrl,
    processedImageUrl,
    errors,
  };
};

describe("When no options are passed", () => {
  const secondSetup = () => setup({});

  it("Returns image with automatic webP support url", () => {
    const { originalImageUrl, processedImageUrl } = secondSetup();

    expect(processedImageUrl).toBe(`${originalImageUrl}/m/`);
  });

  it("Has no errors", () => {
    const { errors } = secondSetup();

    expect(errors).toHaveLength(0);
  });
});

describe("When changing image format", () => {
  const secondSetup = (format: ImageUrlParameters["format"]) =>
    setup({
      imageServiceParameters: { format },
    });

  describe("To .jpeg", () => {
    const thirdSetup = () => secondSetup("jpeg");

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:format(jpeg)`
      );
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("To .png", () => {
    const thirdSetup = () => secondSetup("png");

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:format(png)`
      );
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("To .webp", () => {
    const thirdSetup = () => secondSetup("webp");

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:format(webp)`
      );
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });
});

describe("When setting image quality", () => {
  const secondSetup = (quality: number) =>
    setup({
      imageServiceParameters: {
        quality,
      },
    });

  describe("And we pass a valid quality", () => {
    const thirdSetup = () => secondSetup(42);

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:quality(42)`
      );
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("And we pass a float quality", () => {
    const thirdSetup = () => secondSetup(12.4);

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:quality(12.4)`
      );
    });

    it("Has quality error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("quality");
    });
  });

  describe("And we pass a quality < 0", () => {
    const thirdSetup = () => secondSetup(-2);

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:quality(-2)`
      );
    });

    it("Has quality error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("quality");
    });
  });

  describe("And we pass a quality > 100", () => {
    const thirdSetup = () => secondSetup(101);

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:quality(101)`
      );
    });

    it("Has quality error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("quality");
    });
  });
});

// Should be moved to resizing
describe("When using smart crop", () => {
  it("Returns processed image url", () => {
    const { originalImageUrl, processedImageUrl } = setup({
      imageServiceParameters: {
        resize: {
          width: 600,
          height: 130,
          focalPoint: "smart",
        },
      },
    });

    expect(processedImageUrl).toBe(`${originalImageUrl}/m/600x130/smart/`);
  });
});

describe("When using grayscale", () => {
  const secondSetup = () =>
    setup({
      imageServiceParameters: {
        grayscale: true,
      },
    });

  it("Returns processed image url", () => {
    const { originalImageUrl, processedImageUrl } = secondSetup();

    expect(processedImageUrl).toBe(`${originalImageUrl}/m/filters:grayscale()`);
  });

  it("Has no errors", () => {
    const { errors } = secondSetup();

    expect(errors).toHaveLength(0);
  });
});

describe("When using blur", () => {
  const secondSetup = (blur: ImageUrlParameters["blur"]) =>
    setup({
      imageServiceParameters: {
        blur,
      },
    });

  describe("With a valid radius, without sigma", () => {
    const thirdSetup = () =>
      secondSetup({
        radius: 4,
      });

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/filters:blur(4)`);
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("With a valid radius, sigma", () => {
    const thirdSetup = () =>
      secondSetup({
        radius: 4,
        sigma: 2,
      });

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/filters:blur(4,2)`);
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("With non-integer radius", () => {
    const thirdSetup = () =>
      secondSetup({
        radius: 23.54,
      });

    it("Has blur.radius error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("blur.radius");
    });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:blur(23.54)`
      );
    });
  });

  describe("With negative radius", () => {
    const thirdSetup = () =>
      secondSetup({
        radius: -2,
      });

    it("Has blur.radius error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("blur.radius");
    });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/filters:blur(-2)`);
    });
  });

  describe("With radius > 150", () => {
    const thirdSetup = () =>
      secondSetup({
        radius: 152,
      });

    it("Has blur.radius error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("blur.radius");
    });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/filters:blur(152)`);
    });
  });

  describe("With non-integer sigma", () => {
    const thirdSetup = () =>
      secondSetup({
        radius: 5,
        sigma: 7.65,
      });

    it("Has blur.sigma error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("blur.sigma");
    });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:blur(5,7.65)`
      );
    });
  });

  describe("With negative sigma", () => {
    const thirdSetup = () =>
      secondSetup({
        radius: 5,
        sigma: -3,
      });

    it("Has blur.sigma error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("blur.sigma");
    });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:blur(5,-3)`
      );
    });
  });

  describe("With sigma > 150", () => {
    const thirdSetup = () =>
      secondSetup({
        radius: 5,
        sigma: 151,
      });

    it("Has blur.sigma error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("blur.sigma");
    });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:blur(5,151)`
      );
    });
  });
});

describe("When rotating", () => {
  const secondSetup = (rotate: number) =>
    setup({
      imageServiceParameters: {
        rotate,
      },
    });

  describe("And rotation is a positive integer multiple of 90", () => {
    const thirdSetup = () => secondSetup(180);

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:rotate(180)`
      );
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("And rotation is a negative integer multiple of 90", () => {
    const thirdSetup = () => secondSetup(-270);

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:rotate(-270)`
      );
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("And rotation is not an integer multiple of 90", () => {
    const thirdSetup = () => secondSetup(91);

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:rotate(91)`
      );
    });

    it("Has 'rotate' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("rotate");
    });
  });
});

describe("When setting brightness", () => {
  const secondSetup = (brightness: number) =>
    setup({
      imageServiceParameters: { brightness },
    });

  describe("And using a valid brightness", () => {
    const thirdSetup = () => secondSetup(-58);

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:brightness(-58)`
      );
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("And using a non-integer brightness", () => {
    const thirdSetup = () => secondSetup(23.6);

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:brightness(23.6)`
      );
    });

    it("Has brightness error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("brightness");
    });
  });

  describe("And using a brightness < -100", () => {
    const thirdSetup = () => secondSetup(-101);

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:brightness(-101)`
      );
    });

    it("Has brightness error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("brightness");
    });
  });

  describe("And using a brightness > 100", () => {
    const thirdSetup = () => secondSetup(103);

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:brightness(103)`
      );
    });

    it("Has brightness error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("brightness");
    });
  });
});

describe("When flipping image", () => {
  const secondSetup = (flip: ImageUrlParameters["flip"]) =>
    setup({
      imageServiceParameters: { flip },
    });

  describe("Horizontally", () => {
    const thirdSetup = () =>
      secondSetup({
        horizontal: true,
      });

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/-0x0/`);
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("Vertically", () => {
    const thirdSetup = () =>
      secondSetup({
        vertical: true,
      });

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/0x-0/`);
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("Both horizontally and vertically", () => {
    const thirdSetup = () =>
      secondSetup({
        horizontal: true,
        vertical: true,
      });

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/-0x-0/`);
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });
});

describe("When cropping image", () => {
  const secondSetup = (crop: ImageUrlParameters["crop"]) =>
    setup({
      imageServiceParameters: { crop },
    });

  describe("And we use valid crop parameters", () => {
    const thirdSetup = () =>
      secondSetup({
        top: 102,
        left: 300,
        bottom: 320,
        right: 2333,
      });

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/300x102:2333x320/`);
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("And crop.top is a non-integer", () => {
    const thirdSetup = () =>
      secondSetup({
        top: 102.5,
        left: 300,
        bottom: 320,
        right: 2333,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x102.5:2333x320/`
      );
    });

    it("Has crop.top error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("crop.top");
    });
  });

  describe("And crop.top is negative", () => {
    const thirdSetup = () =>
      secondSetup({
        top: -102,
        left: 300,
        bottom: 320,
        right: 2333,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x-102:2333x320/`
      );
    });

    it("Has crop.top error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("crop.top");
    });
  });

  describe("And crop.left is a non-integer", () => {
    const thirdSetup = () =>
      secondSetup({
        top: 102,
        left: 300.54,
        bottom: 320,
        right: 2333,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300.54x102:2333x320/`
      );
    });

    it("Has crop.left error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("crop.left");
    });
  });

  describe("And crop.left is negative", () => {
    const thirdSetup = () =>
      secondSetup({
        top: 102,
        left: -300,
        bottom: 320,
        right: 2333,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/-300x102:2333x320/`
      );
    });

    it("Has crop.left error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("crop.left");
    });
  });

  describe("And crop.right is a non-integer", () => {
    const thirdSetup = () =>
      secondSetup({
        top: 102,
        left: 300,
        bottom: 320,
        right: 2333.1,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x102:2333.1x320/`
      );
    });

    it("Has crop.right error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("crop.right");
    });
  });

  describe("And crop.right is negative", () => {
    const thirdSetup = () =>
      secondSetup({
        top: 102,
        left: 300,
        bottom: 320,
        right: -2333,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x102:-2333x320/`
      );
    });

    it("Has crop.right error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("crop.right");
    });
  });

  describe("And crop.bottom is a non-integer", () => {
    const thirdSetup = () =>
      secondSetup({
        top: 102,
        left: 300,
        bottom: 320.543,
        right: 2333,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x102:2333x320.543/`
      );
    });

    it("Has crop.bottom error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("crop.bottom");
    });
  });

  describe("And crop.bottom is negative", () => {
    const thirdSetup = () =>
      secondSetup({
        top: 102,
        left: 300,
        bottom: -320,
        right: 2333,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x102:2333x-320/`
      );
    });

    it("Has crop.bottom error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("crop.bottom");
    });
  });
});

describe("When resizing image", () => {
  const secondSetup = (resize: ImageUrlParameters["resize"]) =>
    setup({
      imageServiceParameters: { resize },
    });

  describe("And we're resizing both by width and height with valid values", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 500,
        width: 500,
      });

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/500x500/`);
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("And we're resizing by width only with a valid value", () => {
    const thirdSetup = () =>
      secondSetup({
        width: 200,
      });

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/200x0/`);
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("And we're resizing by height only with a valid value", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 200,
      });

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/0x200/`);
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("And width is a non-integer", () => {
    const thirdSetup = () =>
      secondSetup({
        width: 200.34,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/200.34x0/`);
    });

    it("Has 'resize.width' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.width");
    });
  });

  describe("And width is a negative value", () => {
    const thirdSetup = () =>
      secondSetup({
        width: -200,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/-200x0/`);
    });

    it("Has 'resize.width' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.width");
    });
  });

  describe("And height is a non-integer", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 200.34,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/0x200.34/`);
    });

    it("Has 'resize.height' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.height");
    });
  });

  describe("And height is a negative value", () => {
    const thirdSetup = () =>
      secondSetup({
        height: -200,
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/0x-200/`);
    });

    it("Has 'resize.height' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.height");
    });
  });

  describe("And we're using fit-in option", () => {
    const thirdSetup = (
      resize: Pick<NonNullable<ImageUrlParameters["resize"]>, "fill">
    ) =>
      secondSetup({
        fitIn: true,
        height: 200,
        width: 200,
        ...resize,
      });

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup({});

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/fit-in/200x200/`);
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup({});

      expect(errors).toHaveLength(0);
    });

    describe("And we're using a hex color without alpha fill", () => {
      const fourthSetup = () =>
        thirdSetup({
          fill: "AABBCC",
        });

      it("Returns processed image url", () => {
        const { originalImageUrl, processedImageUrl } = fourthSetup();

        expect(processedImageUrl).toBe(
          `${originalImageUrl}/m/fit-in/200x200/filters:fill(AABBCC)`
        );
      });

      it("Has no errors", () => {
        const { errors } = fourthSetup();

        expect(errors).toHaveLength(0);
      });
    });

    describe("And we're using a hex color with alpha fill", () => {
      const fourthSetup = () =>
        thirdSetup({
          fill: "AABBCC37",
        });

      it("Returns processed image url", () => {
        const { originalImageUrl, processedImageUrl } = fourthSetup();

        expect(processedImageUrl).toBe(
          `${originalImageUrl}/m/fit-in/200x200/filters:fill(AABBCC37)`
        );
      });

      it("Has no errors", () => {
        const { errors } = fourthSetup();

        expect(errors).toHaveLength(0);
      });
    });

    describe("And we're using an invalid fill", () => {
      const fourthSetup = () =>
        thirdSetup({
          fill: "abc",
        });

      it("Returns processed image (best-effort) url", () => {
        const { originalImageUrl, processedImageUrl } = fourthSetup();

        expect(processedImageUrl).toBe(
          `${originalImageUrl}/m/fit-in/200x200/filters:fill(abc)`
        );
      });

      it("Has 'resize.fill' error", () => {
        const { errors } = fourthSetup();

        expect(errors).toHaveLength(1);
        expect(errors[0]).toMatch("resize.fill");
      });
    });
  });

  describe("And we're setting a valid focal point (which is actually a rectangle)", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 200,
        width: 300,
        focalPoint: {
          left: 100,
          top: 200,
          bottom: 300,
          right: 400,
        },
      });

    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x200/filters:focal(100x200:400x300)`
      );
    });

    it("Has no errors", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(0);
    });
  });

  describe("And we're using a non-integer focal point left coordinate", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 200,
        width: 300,
        focalPoint: {
          left: 100.34,
          top: 200,
          bottom: 300,
          right: 400,
        },
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x200/filters:focal(100.34x200:400x300)`
      );
    });

    it("Has 'resize.focalPoint.left' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.focalPoint.left");
    });
  });

  describe("And we're using a negative focal point left coordinate", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 200,
        width: 300,
        focalPoint: {
          left: -100,
          top: 200,
          bottom: 300,
          right: 400,
        },
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x200/filters:focal(-100x200:400x300)`
      );
    });

    it("Has 'resize.focalPoint.left' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.focalPoint.left");
    });
  });

  describe("And we're using a non-integer focal point top coordinate", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 200,
        width: 300,
        focalPoint: {
          left: 100,
          top: 200.2,
          bottom: 300,
          right: 400,
        },
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x200/filters:focal(100x200.2:400x300)`
      );
    });

    it("Has 'resize.focalPoint.top' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.focalPoint.top");
    });
  });

  describe("And we're using a negative focal point top coordinate", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 200,
        width: 300,
        focalPoint: {
          left: 100,
          top: -200,
          bottom: 300,
          right: 400,
        },
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x200/filters:focal(100x-200:400x300)`
      );
    });

    it("Has 'resize.focalPoint.top' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.focalPoint.top");
    });
  });

  describe("And we're using a non-integer focal point bottom coordinate", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 200,
        width: 300,
        focalPoint: {
          left: 100,
          top: 200,
          bottom: 300.234,
          right: 400,
        },
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x200/filters:focal(100x200:400x300.234)`
      );
    });

    it("Has 'resize.focalPoint.bottom' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.focalPoint.bottom");
    });
  });

  describe("And we're using a negative focal point bottom coordinate", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 200,
        width: 300,
        focalPoint: {
          left: 100,
          top: 200,
          bottom: -300,
          right: 400,
        },
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x200/filters:focal(100x200:400x-300)`
      );
    });

    it("Has 'resize.focalPoint.bottom' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.focalPoint.bottom");
    });
  });

  describe("And we're using a non-integer focal point right coordinate", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 200,
        width: 300,
        focalPoint: {
          left: 100,
          top: 200,
          bottom: 300,
          right: 400.1,
        },
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x200/filters:focal(100x200:400.1x300)`
      );
    });

    it("Has 'resize.focalPoint.right' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.focalPoint.right");
    });
  });

  describe("And we're using a negative focal point right coordinate", () => {
    const thirdSetup = () =>
      secondSetup({
        height: 200,
        width: 300,
        focalPoint: {
          left: 100,
          top: 200,
          bottom: 300,
          right: -400,
        },
      });

    it("Returns processed (best effort) image url", () => {
      const { originalImageUrl, processedImageUrl } = thirdSetup();

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x200/filters:focal(100x200:-400x300)`
      );
    });

    it("Has 'resize.focalPoint.right' error", () => {
      const { errors } = thirdSetup();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch("resize.focalPoint.right");
    });
  });
});

describe("When using everything together", () => {
  it("Returns processed image url", () => {
    const { originalImageUrl, processedImageUrl } = setup({
      imageServiceParameters: {
        format: "png",
        blur: {
          radius: 23,
          sigma: 42,
        },
        brightness: -38,
        resize: {
          height: 100,
          width: 1200,
          focalPoint: {
            left: 100,
            top: 0,
            bottom: 300,
            right: 10,
          },
        },
        flip: {
          horizontal: true,
          vertical: false,
        },
        grayscale: true,
        quality: 80,
        rotate: 270,
      },
    });

    expect(processedImageUrl).toBe(
      `${originalImageUrl}/m/-1200x100/filters:format(png):quality(80):focal(100x0:10x300):grayscale():blur(23,42):rotate(270):brightness(-38)`
    );
  });
});

describe("When receiving a storyblok image component", () => {
  it("Works as expected by extracting image url from component", () => {
    const originalImageUrl =
      "https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg";
    const processedImageUrl = imageUrl(
      {
        filename: originalImageUrl,
      },
      {
        format: "png",
        blur: {
          radius: 23,
          sigma: 42,
        },
        brightness: -38,
        resize: {
          height: 100,
          width: 1200,
          focalPoint: {
            left: 100,
            top: 0,
            bottom: 300,
            right: 10,
          },
        },
        flip: {
          horizontal: true,
          vertical: false,
        },
        grayscale: true,
        quality: 80,
        rotate: 270,
      }
    );

    expect(processedImageUrl).toBe(
      `${originalImageUrl}/m/-1200x100/filters:format(png):quality(80):focal(100x0:10x300):grayscale():blur(23,42):rotate(270):brightness(-38)`
    );
  });
});

describe("When there are multiple errors at once", () => {
  const secondSetup = () =>
    setup({
      imageServiceParameters: {
        blur: {
          radius: -32,
          sigma: 2.454,
        },
        brightness: 170,
        quality: -1,
        rotate: 60,
        resize: {
          height: 14.2,
          width: -13,
          fitIn: true,
          fill: "#aabcef",
        },
      },
    });

  it("Aggregates all errors", () => {
    const { errors } = secondSetup();

    expect(errors.find((e) => e.includes("blur.radius"))).toBeDefined();
    expect(errors.find((e) => e.includes("blur.sigma"))).toBeDefined();
    expect(errors.find((e) => e.includes("brightness"))).toBeDefined();
    expect(errors.find((e) => e.includes("quality"))).toBeDefined();
    expect(errors.find((e) => e.includes("rotate"))).toBeDefined();
    expect(errors.find((e) => e.includes("resize.height"))).toBeDefined();
    expect(errors.find((e) => e.includes("resize.width"))).toBeDefined();
    expect(errors.find((e) => e.includes("resize.fill"))).toBeDefined();
    expect(errors).toHaveLength(8);
  });
});
