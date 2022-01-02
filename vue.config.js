module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === "production" ? "/admin/" : "/",
    outputDir: "admin"
}