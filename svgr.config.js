module.exports = {
    svgProps: {
      width: '{props.width || \"1em\"}',
      height: '{props.height || \"1em\"}',
    },
    // Hoặc để width/height tự động nhận từ props, không lấy từ SVG gốc
    dimensions: false,
  };
  