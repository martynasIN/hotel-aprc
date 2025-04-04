class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString
    }

    filter(){
        const queryObj = {...this.queryString};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el=> {delete queryObj[el]});
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`)
        this.query = this.query.find(JSON.parse(queryStr));
        return this
    }

    sort(){
        if(this.queryString.sort){
            console.log('query string: ', this.queryString)
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log('sort by: ', sortBy)
            this.query = this.query.sort(sortBy + ' _id');
        }else{
            this.query = this.query.sort('-createdAt _id');
        }

        return this;
    }

    limitfields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        }else{
            this.query = this.query.select('-__v')
        }

        return this
    }

    paginate(){
        const page = parseInt(this.queryString.page) || 1
        const limit = parseInt(this.queryString.limit) || 2
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this
    }
}

module.exports = APIFeatures