const commentService = require("../services/comment.service");

const getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.postId);
    res.status(200).json({ status: "success", data: comments });
  } catch (error) {
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(
      req.params.postId,
      req.body.content,
      req.user._id
    );
    res.status(201).json({ status: "success", data: comment });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.updateComment(
      req.params.commentId,
      req.body.content,
      req.user._id
    );
    res.status(200).json({ status: "success", data: comment });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(
      req.params.commentId,
      req.user._id,
      req.user.role
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getCommentsByPost, createComment, updateComment, deleteComment };