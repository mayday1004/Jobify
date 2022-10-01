const APIquery = class {
  constructor(model, reqQuery) {
    this.foundQuery = model;
    this.reqQuery = reqQuery;

    const queryObj = { ...this.reqQuery };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]); //排除'page', 'sort', 'limit', 'fields'項目

    //為query添加條件篩選 : 找出duration>5的
    /* MongoDb用法: {duration:{$gt:5}} */
    // http://localhost:3000/?duration[gt]=5 => { duration: { 'gt': '5' } } 缺$符
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.foundQuery = this.foundQuery.find(JSON.parse(queryStr)).setOptions({ strictQuery: false });
  }

  sort() {
    //為query添加排序功能: 依照price,ratingsAverage大小排序:升序正數;降序負數
    // http://localhost:3000/api/v1/tours?sort=price,ratingsAverage
    /* Mongoose用法:.sort("price ratingsAverage") */
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.foundQuery = this.foundQuery.sort(sortBy);
    }
    return this;
  }

  fields() {
    // 為query添加顯示指定內容功能:name、price、difficulty、ratingsAverage、id
    // http://localhost:3000/api/v1/tours?fields=name,price,difficulty,ratingsAverage,id
    /* Mongoose用法:.select("name price difficulty ratingsAverage id") */
    if (this.reqQuery.fields) {
      const showFields = this.reqQuery.fields.split(',').join(' ');
      this.foundQuery = this.foundQuery.select(showFields);
    } else {
      this.foundQuery = this.foundQuery.select('-__v'); //默認不要顯示__v === Schema中添加select: false,
    }
    return this;
  }

  page() {
    // 為query添加分頁功能:1頁10筆內容 1-10 page1; 11-20 page2; 21-30 page3...
    // http://localhost:3000/api/v1/tours?limit=10&page=1
    /* Mongoose用法:.skip((p-1)*limit).limit(10) */
    const page = +this.reqQuery.page || 1;
    const limit = +this.reqQuery.limit || 10;
    const skip = (page - 1) * limit;
    this.foundQuery = this.foundQuery.skip(skip).limit(limit);
    return this;
  }
};

module.exports = APIquery;
