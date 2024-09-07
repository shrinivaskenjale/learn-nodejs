const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

// Factory functions are functions that return another function.
// Most of the code for similar actions is same for each resource in our application. We can write more generic handler so that we can reuse the code.

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new AppError("No document found with specified ID.", 404));
    }

    // Standard is to send response with no data with status code 204 back to user on delete request.
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    // By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.

    if (!document) {
      return next(new AppError("No document found with specified ID.", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    // 201 - created
    res.status(201).json({
      status: "success",
      data: {
        data: newDocument,
      },
    });
  });

exports.getOne = (Model, populateFields) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    // Use populate() to fetch referenced documents.
    // const tour = await Tour.findById(id).populate("guides");
    // Advanced populate query
    // const tour = await Tour.findById(id).populate({
    //   path: "guides",
    //   select: "-__v -passwordChangedAt",
    // });

    // We implemented populate() in pre middleware for all find queries. Populate queries just for this route are implemented here.
    if (populateFields) {
      query = query.populate(populateFields);
    }
    const document = await query;

    if (!document) {
      return next(new AppError("No document found with specified ID.", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Construct the query
    const features = new APIFeatures(Model, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // Execute the query
    const documents = await features.query.explain();

    // We could send 404 error if 0 results are found or if requested page does not exist. But actually there was no error because DB searched for documents with specified filter and found 0 documents. So, 0 records are exactly what we will send to client with 200 status code.

    // But if there is any database failure, mongoose will automatically throw the error.

    // 200 - ok
    res.status(200).json({
      status: "success",
      results: documents.length,
      data: {
        data: documents,
      },
    });
    // results is not part of JSend spec, but we send it in case data is array.
  });
