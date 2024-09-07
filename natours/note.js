exports.getAllTours = async (req, res) => {
  try {
    let { page, sort, limit, fields, ...filter } = req.query;
    let query;

    // ==================
    // Filtering
    // ==================

    /**
     * We filter the data by passing filter using query parameters.
     * ?difficulty=easy&duration=5
     *
     * Query parameters can include other paramters which are not related to filtering, like for pagination. We should separate the filter parameters on server dynamically as we don't know in advance exactly which filter query parameters will request have.
     * ?difficulty=easy&duration=5&sort=asc&page=3
     *
     * Advanced filtering:
     * To filter documents using other operators (like >= or <), standard way is to use square brackets in query string.
     * ?duration[gte]=5
     * Above query filters the tours with duration greater than or equal to 5 days.
     *
     * Query string containing square brackets creates nested req.query object which is similar to mongodb filter object.
     * Mongodb filter operators have $ sign in front of them. So, convert filter object to match that syntax.
     *
     *
     */

    // Adavanced filtering:
    let filterString = JSON.stringify(filter);
    // Following regex replaces all specified strings only if thery are one word. So no problem if any of these strings are part of words.
    filterString = filterString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    filter = JSON.parse(filterString);
    query = Tour.find(filter);

    // ==================
    // Sorting
    // ==================

    /**
     * Query parameter 'sort' contains the field to sort with.
     *
     * If sort value has '-' in front of it, mongoose sorts that field in descending order.
     * ?sort=-price
     *
     * We can specify multiple fields separated by space. If value of field of 2 or more documents is same then order is decided using next field.
     * To pass multiple fields in query string, separate them with comma(,).
     * ?sort=-price,ratingsAverage
     *
     * We have to replace comma with space.
     */

    if (sort) {
      sort = sort.replaceAll(",", " ") + " _id";
      query = query.sort(sort);
    } else {
      query = query.sort("-createdAt _id");
    }

    // ==================
    // Limiting fields / Projection
    // ==================
    /**
     * Limiting fields helps to save bandwidth.
     *
     * 'fields' query parameter has comma(,) separated list of fields required in response.
     * ?fields=name,duration,difficulty,price
     *
     * select() method on query object takes space separated list of fields.
     *
     * _id field is added automatically.
     *
     * Instead of specifying fields to be included, we can specify fields to be excluded by prefixing them with - sign.
     * ?fields=-name,-duration
     *
     * Alternatively, 'select' SchemaType specifies default projections for queries, which takes boolean value.
     */

    if (fields) {
      fields = fields.replaceAll(",", " ");
      query = query.select(fields);
    } else {
      // Mongoose adds __v field.
      query = query.select("-__v");
    }

    // ==================
    // Pagination
    // ==================
    /**
     * Query parameter 'page' specifies requested page and 'limit' specifies no. of records per page.
     * ?limit=3&page=1
     *
     * We have to skip ('page'-1)*'limit' no. of records from DB and query next 'limit' no. of records.
     *
     * If user requests a page that does not exist then throw error.
     *
     * If using skip() with sort(), be sure to include at least one field in your sort that contains unique values, before passing results to skip(). This avoids inconsistent results.
     */

    // Convert query parameters to number and set default values
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skipCount = (page - 1) * limit;
    query = query.skip(skipCount).limit(limit);

    if (page) {
      const toursCount = await Tour.countDocuments();
      if (skipCount >= toursCount) {
        throw new Error("This page does not exist.");
      }
    }

    // ==================
    // Execute the query
    // ==================
    const tours = await query;

    // 200 - ok
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours: tours,
      },
    });
    // results is not part of JSend spec, but we send it in case data is array.
  } catch (error) {
    // 400 - bad request
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
