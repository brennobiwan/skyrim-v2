exports.get404 = (req, res, next) => {
    res.status(404).render('404', { fail: "Page Not Found" });
    console.log("PAGE NOT FOUND");
};