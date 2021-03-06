'use strict';

const Service = require('egg').Service;
class CompanyService extends Service {
  async list(filter, limit = 10, offset = 0) {
    const ctx = this.ctx;
    const [ list, total ] = await Promise.all([
      ctx.model.Company.find(filter).skip(offset).limit(limit)
        .lean()
        .exec(),
      ctx.model.Company.countDocuments(filter)
        .lean()
        .exec(),
    ]);
    return { list, total, code: 0 };
  }
  async get(id) {
    const ctx = this.ctx;
    const doc = await ctx.model.Company.findOne({ id }).lean().exec();
    return { code: 0, data: doc };
  }
  async add(data = {}) {
    const ctx = this.ctx;
    const exist = await this.nameExist(data.name, data.id);
    if (exist) {
      return {
        code: 1,
        msg: '公司名重复',
      };
    }
    const CompanyModel = ctx.model.Company({
      id: ctx.helper.generateId(),
      compName: data.compName,
      status: data.status,
      address: data.address,
      bossName: data.bossName,
      bossPhone: data.bossPhone,
      dueDate: data.dueDate,
    });
    await CompanyModel.save();
    return { code: 0 };
  }
  async update(id, data = {}) {
    const ctx = this.ctx;
    const CompanyModel = await ctx.model.Company.findOne({ id }).exec();
    if (!CompanyModel) {
      return {
        code: 1,
        msg: 'Company不存在',
      };
    }
    if (typeof data.compName !== 'undefined') {
      CompanyModel.compName = data.compName;
    }
    if (typeof data.status !== 'undefined') {
      CompanyModel.status = data.status;
    }
    if (typeof data.address !== 'undefined') {
      CompanyModel.address = data.address;
    }
    if (typeof data.bossName !== 'undefined') {
        CompanyModel.bossName = data.bossName;
    }
    if (typeof data.bossPhone !== 'undefined') {
    CompanyModel.bossPhone = data.bossPhone;
    }
    if (typeof data.dueDate !== 'undefined') {
    CompanyModel.dueDate = data.dueDate;
    }
    await CompanyModel.save();
    return { code: 0 };
  }
  async remove(id) {
    const ctx = this.ctx;
    const Company = await ctx.model.Company.findOne({ id }).exec();
    if (!Company) {
      return {
        code: 0,
        msg: '该公司不存在',
      };
    }
    await Company.remove();
    return {
      code: 0,
    };
  }
  async nameExist(name, id) {
    const ctx = this.ctx;
    const filter = {
      name,
    };
    if (id) {
      filter.id = { $ne: id };
    }
    const Company = await ctx.model.Company.findOne(filter).lean().exec();
    return !!Company;
  }
}
module.exports = CompanyService;
