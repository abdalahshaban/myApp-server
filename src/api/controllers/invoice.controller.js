import Joi from 'joi';
import HttpStatus from 'http-status-codes';

import Invoice from '../models/invoice.model';

export default {
  findAll(req, res) {
    Invoice.find().then(invoices => {
      return res.json(invoices);
    }).catch(err => {
      return res.status(HttpStatus.BAD_REQUEST).json(err);
    })
  },
  create(req, res) {
    const { item, qty, date, due, tax, rate } = req.body

    const schema = Joi.object().keys({
      item: Joi.string().required(),
      date: Joi.date().required(),
      due: Joi.date().required(),
      qty: Joi.number().integer().required(),
      tax: Joi.number().optional(),
      rate: Joi.number().optional(),
    })

    const { error, value } = Joi.validate(req.body, schema)

    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json(error.details);
    }

    Invoice.create(value)
      .then(invoice => {
        return res.json({ message: invoice });
      }).catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err });
      })
  },
  findOne(req, res) {
    let { id } = req.params;
    Invoice.findById(id)
      .then(invoice => {
        if (!invoice) {
          return res.status(HttpStatus.NOT_FOUND).json({ err: 'Invoice not fount' });
        }
        return res.json(invoice);
      })
  },

  delete(req, res) {
    const { id } = req.params;

    Invoice.findByIdAndRemove(id)
      .then(invoice => {
        return res.json({ message: `success delete ${invoice}` });
      })
      .catch(err => {
        return res.status(HttpStatus.NOT_FOUND).json({ message: `can not delet` });
      })
  },
  update(req, res) {
    const { id } = req.params

    const schema = Joi.object().keys({
      item: Joi.string().optional(),
      date: Joi.date().optional(),
      due: Joi.date().optional(),
      qty: Joi.number().integer().optional(),
      tax: Joi.number().optional(),
      rate: Joi.number().optional(),
    })

    const { error, value } = Joi.validate(req.body, schema)

    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json(error.details);
    }
    Invoice.findOneAndUpdate({ _id: id }, value, { new: true })
      .then(invoice => {
        return res.json(invoice);
      })
      .catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
      })
  }
};
