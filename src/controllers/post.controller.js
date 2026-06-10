const postService = require("../services/post.service");

const getAllPosts = async (req, res, next) => {
  try {
    const result = await postService.getAllPosts(req.query);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);

    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const getPostBySlug = async (req, res, next) => {
  try {
    const post = await postService.getPostBySlug(req.params.slug);
    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.body, req.user._id);
    res.status(201).json({ status: "success", data: post });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(req.params.slug, req.body, req.user._id);
    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.slug, req.user._id, req.user.role);
    res.status(204).send(); // 204: success sin body
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllPosts, getPostById, getPostBySlug, createPost, updatePost, deletePost };