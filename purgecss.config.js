const destination = process.env.JEKYLL_DESTINATION || "_site";
module.exports = {
  content: [destination + "/**/*.html", destination + "/**/*.js"],
  css: [destination + "/assets/css/*.css"],
  output: destination + "/assets/css/",
  skippedContentGlobs: [destination + "/assets/**/*.html"]
};
