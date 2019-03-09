const mongoose = require("mongoose");
const Store = mongoose.model("Store");

exports.homePage = (req, res) => {
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add Store" });
};

exports.createStore = async (req, res) => {
  const store = await new Store(req.body).save();
  req.flash(
    "success",
    `Succesfully created ${store.name}. Care to leave a review?`
  );
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // 1. Query the database for a list of all stores
  const stores = await Store.find();
  res.render("stores", { title: "Stores", stores });
};

exports.editStore = async (req, res) => {
  // 1 find the store given the id
  const store = await Store.findOne({ _id: req.params.id });
  // 2 confirm they are the owner of the store
  // 3 render out the edit form so the user can update
  res.render("editStore", { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // set the location date to be a point, when updated the defaults don't kick in so we gotta do it manually
  req.body.location.type = "Point";
  // find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store instead of the old
    runValidators: true
  }).exec();
  req.flash(
    "succes",
    `Succesfully updated <strong>${store.name}</strong>. <a href="/stores/${
      store.slug
    }">View store</a>`
  );
  // redirect them and tell them that it worked
  res.redirect(`/stores/${store._id}/edit`);
};
