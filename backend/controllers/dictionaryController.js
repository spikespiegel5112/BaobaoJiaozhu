const Dictionary = require('../models/DictionaryModel');
const uuidv1 = require('uuid/v1');

const getList = (req, res, next) => {
	let queryParam = req.query;
	let pagination = {};
	let where = {};
	if (queryParam.typeCode && queryParam.typeCode !== '') {
		where = {
			typeCode: queryParam.typeCode
		}
	}
	if (Object.keys(pagination).length > 0) {
		pagination = {
			limit: Number(queryParam.limit),
			offset: req.query.limit * (queryParam.page - 1)
		};
	}
	Dictionary.findAll({
		where: Object.assign(where,pagination)
	}).then(async data => {
		res.status(200).json({
			pagination: {
				total: await Dictionary.count()
			},
			data
		})
	}).catch(error => {
		res.status(500).json({
			error: {
				message: error,
			}
		})
	})
};

const createOrUpdate = (req, res, next) => {
	console.log('createOrUpdate', req.body);
	let dictionaryId = req.body.dictionaryId;


	if (!dictionaryId || dictionaryId === '') {
		console.log('create');
		Dictionary.create({
			dictionaryId: uuidv1(),
			typeName: req.body.typeName,
			typeCode: req.body.typeCode,
			code: req.body.code,
			name: req.body.name,
		}).then(data => {
			res.status(200).json({
				data
			})
		}).catch(error => {
			res.status(500).json({
				error: {
					message: error,
				}
			})
		})
	} else {
		console.log('update');
		Dictionary.findOne({
			where: {
				dictionaryId: req.body.dictionaryId
			}
		}).then(async data => {
			data.typeCode = req.body.typeCode;
			data.typeName = req.body.typeName;
			data.code = req.body.code;
			data.name = req.body.name;
			await data.save();
			res.status(200).json({
				data
			})
		}).catch(error => {
			res.status(500).json({
				error: {
					message: 'Failed',
					req: req.body,
					error
				}
			})
		})
	}

};

const deleteItem = (req, res, next) => {
	console.log(req.body);
	const idBody = req.body.id;
	console.log(idBody instanceof Array);
	if (idBody instanceof Array) {
		idBody.forEach((item, index) => {
			Dictionary.findOne({
				where: {
					id: item
				}
			}).then(async response => {
				console.log(response);
				const result = await response.destroy();
				if (index + 1 === idBody.length) {
					res.status(200).json({
						message: 'Delete successful',
						body: result
					});
				}
			}).catch(error => {
				res.status(500).json({
					message: 'Delete failed',
					error
				});
			})
		})
	} else {
		Dictionary.findByPk(idBody).then(result => {
			console.log(result);
			result.destroy().then(() => {
				if (index + 1 === req.body.id.length) {
					res.status(200).json({
						message: 'Delete successful',
						body: result
					});
				}
			})
		}).catch(error => {
			res.status(500).json({
				message: 'Delete failed',
				error
			});
		})
	}
};

exports.getList = getList;
exports.createOrUpdate = createOrUpdate;
exports.deleteItem = deleteItem;
