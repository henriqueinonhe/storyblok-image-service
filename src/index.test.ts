import { imageUrl, ImageUrlOptions } from ".";

type SetupParams = {
  imageServiceOptions?: ImageUrlOptions;
};

const setup = ({ imageServiceOptions }: SetupParams) => {
  const originalImageUrl =
    "https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg";

  const processedImageUrl = imageUrl(originalImageUrl, imageServiceOptions);

  return {
    originalImageUrl,
    processedImageUrl,
  };
};

describe("When no options are passed", () => {
  it("Returns image with automatic webP support url", () => {
    const { originalImageUrl, processedImageUrl } = setup({});

    expect(processedImageUrl).toBe(`${originalImageUrl}/m/`);
  });
});

describe("When resizing image", () => {
  describe("And we're resizing both by width and height", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          resize: {
            height: 500,
            width: 500,
          },
        },
      });

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/500x500/`);
    });
  });

  describe("And we're resizing by width only", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          resize: {
            width: 200,
          },
        },
      });

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/200x0/`);
    });
  });

  describe("And we're resizing by height only", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          resize: {
            height: 200,
          },
        },
      });

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/0x200/`);
    });
  });

  describe("And we're using fit-in option", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          resize: {
            height: 200,
            width: 200,
            fitIn: true,
          },
        },
      });

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/fit-in/200x200/`);
    });

    describe("And we're using a fill", () => {
      it("Returns processed image url", () => {
        const { originalImageUrl, processedImageUrl } = setup({
          imageServiceOptions: {
            resize: {
              height: 200,
              width: 200,
              fitIn: true,
              fill: "CCCCCC",
            },
          },
        });

        expect(processedImageUrl).toBe(
          `${originalImageUrl}/m/fit-in/200x200/filters:fill(CCCCCC)`
        );
      });
    });
  });

  describe("And we're setting a focal point (which is actually a rectangle)", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          resize: {
            height: 200,
            width: 300,
            focalPoint: {
              left: 100,
              top: 200,
              bottom: 300,
              right: 400,
            },
          },
        },
      });

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/300x200/filters:focal(100x200:400x300)`
      );
    });
  });
});

describe("When changing image format", () => {
  describe("To .jpeg", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          format: "jpeg",
        },
      });

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:format(jpeg)`
      );
    });
  });

  describe("To .png", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          format: "png",
        },
      });

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:format(png)`
      );
    });
  });

  describe("To .webp", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          format: "webp",
        },
      });

      expect(processedImageUrl).toBe(
        `${originalImageUrl}/m/filters:format(webp)`
      );
    });
  });
});

describe("When setting image quality", () => {
  it("Returns processed image url", () => {
    const { originalImageUrl, processedImageUrl } = setup({
      imageServiceOptions: {
        quality: 42,
      },
    });

    expect(processedImageUrl).toBe(`${originalImageUrl}/m/filters:quality(42)`);
  });
});

describe("When using smart crop", () => {
  it("Returns processed image url", () => {
    const { originalImageUrl, processedImageUrl } = setup({
      imageServiceOptions: {
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
  it("Returns processed image url", () => {
    const { originalImageUrl, processedImageUrl } = setup({
      imageServiceOptions: {
        grayscale: true,
      },
    });

    expect(processedImageUrl).toBe(`${originalImageUrl}/m/filters:grayscale()`);
  });
});

describe("When using blur", () => {
  describe("Without sigma", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          blur: {
            radius: 4,
          },
        },
      });

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/filters:blur(4)`);
    });
  });

  describe("With sigma", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          blur: {
            radius: 4,
            sigma: 2,
          },
        },
      });

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/filters:blur(4,2)`);
    });
  });
});

describe("When rotating", () => {
  it("Returns processed image url", () => {
    const { originalImageUrl, processedImageUrl } = setup({
      imageServiceOptions: {
        rotate: 180,
      },
    });

    expect(processedImageUrl).toBe(`${originalImageUrl}/m/filters:rotate(180)`);
  });
});

describe("When setting brightness", () => {
  it("Returns processed image url", () => {
    const { originalImageUrl, processedImageUrl } = setup({
      imageServiceOptions: {
        brightness: -58,
      },
    });

    expect(processedImageUrl).toBe(
      `${originalImageUrl}/m/filters:brightness(-58)`
    );
  });
});

describe("When flipping image", () => {
  describe("Horizontally", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          flip: {
            horizontal: true,
          },
        },
      });

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/-0x0/`);
    });
  });

  describe("Vertically", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          flip: {
            vertical: true,
          },
        },
      });

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/0x-0/`);
    });
  });

  describe("Both horizontally and vertically", () => {
    it("Returns processed image url", () => {
      const { originalImageUrl, processedImageUrl } = setup({
        imageServiceOptions: {
          flip: {
            vertical: true,
            horizontal: true,
          },
        },
      });

      expect(processedImageUrl).toBe(`${originalImageUrl}/m/-0x-0/`);
    });
  });
});

describe("When cropping image", () => {
  it("Returns processed image url", () => {
    const { originalImageUrl, processedImageUrl } = setup({
      imageServiceOptions: {
        crop: {
          top: 102,
          left: 300,
          bottom: 320,
          right: 2333,
        },
      },
    });

    expect(processedImageUrl).toBe(`${originalImageUrl}/m/300x102:2333x320/`);
  });
});

describe("When using everything together", () => {
  it("Returns processed image url", () => {
    const { originalImageUrl, processedImageUrl } = setup({
      imageServiceOptions: {
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
