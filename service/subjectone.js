const {get} = require('../utils/request1')
const api = require('../api/index')

export async function getSubjectOneList(data) {
  let {list, ...other} = await get(api.subjectOne, data)
  list = list.map(item => ({
    ...item,
    options: item.options.map(opt => ({
      description: opt,
      className: '',
    })),
  }));
  return {
    ...other,
    list
  }
}