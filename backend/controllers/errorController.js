exports.get404 = (req, res, next) => {
	try {
		res.status(404).render('404', {
			pageTitle: 'Page Not Found'
		})
	} catch (e) {
		res.status(500).render('500', {
			pageTitle: 'error'
		})
	}

};
